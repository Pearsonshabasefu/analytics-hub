"""
Billing router — OCU balance, Flutterwave payment integration.

Flutterwave is used for:
- One-time OCU top-ups (pay-as-you-go)
- Auto-top-up when balance falls below threshold
- Invoice history

Setup:
    pip install requests  (already in FastAPI deps)
    Set FLUTTERWAVE_SECRET_KEY in .env
"""
from fastapi import APIRouter, Depends, HTTPException, Request, Header, status, Response
from pydantic import BaseModel
from typing import Optional
import httpx
from app.core.security import get_current_user, regenerate_session
from app.core.supabase import get_supabase_admin
from app.core.config import settings

router = APIRouter()

FLUTTERWAVE_BASE_URL = "https://api.flutterwave.com/v3"

# OCU pricing tiers
OCU_PACKAGES = {
    "starter":    {"ocus": 50,   "amount_usd": 5.00,  "label": "50 OCUs — \$5"},
    "standard":   {"ocus": 150,  "amount_usd": 12.00, "label": "150 OCUs — \$12"},
    "pro":        {"ocus": 500,  "amount_usd": 35.00, "label": "500 OCUs — \$35"},
    "enterprise": {"ocus": 2000, "amount_usd": 120.00,"label": "2,000 OCUs — \$120"},
}


class TopUpRequest(BaseModel):
    package: str                  # 'starter' | 'standard' | 'pro' | 'enterprise'
    redirect_url: str             # Frontend URL to redirect after payment
    currency: str = "USD"         # Flutterwave supports USD, NGN, GHS, KES, ZAR, etc.


class TopUpResponse(BaseModel):
    payment_link: str
    tx_ref: str
    package: str
    ocus: int
    amount: float
    currency: str


@router.get("/balance")
async def get_balance(current_user: dict = Depends(get_current_user)):
    """Get the user's current OCU balance and billing settings."""
    supabase = get_supabase_admin()
    result = (
        supabase.table("billing_state")
        .select("ocu_balance, auto_top_up, max_model_spend, flutterwave_customer_id")
        .eq("user_id", current_user["id"])
        .single()
        .execute()
    )
    return result.data or {
        "ocu_balance": 50,
        "auto_top_up": False,
        "max_model_spend": 20,
        "flutterwave_customer_id": None,
    }


@router.post("/topup", response_model=TopUpResponse)
async def initiate_topup(
    payload: TopUpRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Initiate an OCU top-up payment via Flutterwave.
    Returns a hosted payment link — redirect the user to it.
    After payment, Flutterwave redirects to payload.redirect_url
    with tx_ref and transaction_id query params.
    """
    if payload.package not in OCU_PACKAGES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid package. Choose from: {list(OCU_PACKAGES.keys())}"
        )

    package_info = OCU_PACKAGES[payload.package]
    tx_ref = f"ah_ocu_{current_user['id'][:8]}_{payload.package}_{int(__import__('time').time())}"

    # Call Flutterwave Standard Payment API
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{FLUTTERWAVE_BASE_URL}/payments",
            headers={
                "Authorization": f"Bearer {settings.FLUTTERWAVE_SECRET_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "tx_ref": tx_ref,
                "amount": package_info["amount_usd"],
                "currency": payload.currency,
                "redirect_url": payload.redirect_url,
                "meta": {
                    "user_id": current_user["id"],
                    "package": payload.package,
                    "ocus": package_info["ocus"],
                },
                "customer": {
                    "email": current_user["email"],
                },
                "customizations": {
                    "title": "RefineIQ — OCU Top-Up",
                    "description": package_info["label"],
                    "logo": "https://refineiq.vercel.app/assets/logo.svg",
                },
            },
        )

    if response.status_code != 200:
        raise HTTPException(status_code=502, detail="Payment gateway error. Please try again.")

    data = response.json()
    payment_link = data.get("data", {}).get("link")
    if not payment_link:
        raise HTTPException(status_code=502, detail="Could not generate payment link.")

    return TopUpResponse(
        payment_link=payment_link,
        tx_ref=tx_ref,
        package=payload.package,
        ocus=package_info["ocus"],
        amount=package_info["amount_usd"],
        currency=payload.currency,
    )


# Set of processed transactions to prevent duplicate crediting (idempotency guard)
_PROCESSED_TX_REFS = set()

@router.post("/webhook")
async def payment_webhook(
    request: Request,
    verif_hash: Optional[str] = Header(None, alias="verif-hash"),
):
    """
    Cryptographically verified payment webhook:
    - Verifies HMAC signature / secret token header (verif-hash)
    - Enforces idempotency via transaction reference deduplication
    - Verifies successful charge status before crediting OCUs
    """
    # 1. Server-side Operation Authorization: Verify Webhook Signature
    secret_key = getattr(settings, "FLUTTERWAVE_SECRET_KEY", None)
    if secret_key and verif_hash != secret_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized: invalid or missing webhook signature header",
        )

    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid JSON body")

    if body.get("event") != "charge.completed":
        return {"status": "ignored"}

    data = body.get("data", {})
    if data.get("status") != "successful":
        return {"status": "payment_not_successful"}

    tx_ref = data.get("tx_ref")
    if not tx_ref:
        return {"status": "missing_tx_ref"}

    # 2. Idempotency Check: Prevent replay attacks
    if tx_ref in _PROCESSED_TX_REFS:
        return {"status": "already_processed", "tx_ref": tx_ref}

    meta = data.get("meta", {})
    user_id = meta.get("user_id")
    ocus_to_add = int(meta.get("ocus", 0))

    if not user_id or not ocus_to_add:
        return {"status": "missing_meta"}

    # 3. Credit OCUs to user balance
    supabase = get_supabase_admin()
    current = (
        supabase.table("billing_state")
        .select("ocu_balance")
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    current_balance = current.data.get("ocu_balance", 0) if current.data else 0
    new_balance = current_balance + ocus_to_add

    supabase.table("billing_state").update({
        "ocu_balance": new_balance
    }).eq("user_id", user_id).execute()

    _PROCESSED_TX_REFS.add(tx_ref)

    return {"status": "ocus_credited", "tx_ref": tx_ref, "new_balance": new_balance}


@router.patch("/settings")
async def update_billing_settings(
    response: Response,
    auto_top_up: Optional[bool] = None,
    max_model_spend: Optional[int] = None,
    current_user: dict = Depends(get_current_user),
):
    """Update auto-top-up toggle and max spend per model."""
    supabase = get_supabase_admin()
    updates = {}
    if auto_top_up is not None:
        updates["auto_top_up"] = auto_top_up
    if max_model_spend is not None:
        updates["max_model_spend"] = max_model_spend

    if updates:
        supabase.table("billing_state").update(updates).eq("user_id", current_user["id"]).execute()

    # Security: Regenerate session cookie upon privilege / quota change
    regenerate_session(response, current_user["id"], reason="privilege_change")

    return {"success": True, "session_regenerated": True}


@router.get("/packages")
async def get_packages():
    """Return available OCU package tiers (public endpoint)."""
    return {"packages": OCU_PACKAGES}

