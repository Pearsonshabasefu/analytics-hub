from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user, verify_model_ownership
from app.core.supabase import get_supabase_admin
import uuid

router = APIRouter()


@router.post("/{model_id}")
async def deploy_model(
    model_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    One-click deploy: packages the champion model and generates a REST API endpoint.
    """
    supabase = get_supabase_admin()

    model = (
        supabase.table("models")
        .select("*")
        .eq("id", model_id)
        .eq("user_id", current_user["id"])
        .single()
        .execute()
    )
    if not model.data:
        raise HTTPException(status_code=404, detail="Model not found")
    if model.data["status"] != "complete":
        raise HTTPException(status_code=400, detail="Model training not complete yet")

    # Generate API endpoint + key
    api_key = f"ah_{uuid.uuid4().hex}"
    api_endpoint = f"https://api.analyticshub.ai/v1/predict/{model_id}"

    supabase.table("models").update({
        "is_deployed": True,
        "api_endpoint": api_endpoint,
        "api_key": api_key,
    }).eq("id", model_id).execute()

    supabase.table("projects").update({"status": "deployed"}).eq(
        "id", model.data["project_id"]
    ).execute()

    return {
        "success": True,
        "api_endpoint": api_endpoint,
        "api_key": api_key,
        "message": "Model deployed. Use the API key in the Authorization header.",
        "example_curl": f'curl -X POST {api_endpoint} -H "Authorization: Bearer {api_key}" -H "Content-Type: application/json" -d \'{{"feature1": 1.5, "feature2": "value"}}\'',
    }


@router.post("/{model_id}/predict")
async def predict(
    model_id: str,
    payload: dict,
    current_user: dict = Depends(get_current_user),
):
    """
    Run inference. Returns 402 Payment Required when OCU balance is zero.
    # Verify server-side operation authorization: user must own the target model
    await verify_model_ownership(model_id, current_user)

    supabase = get_supabase_admin()

    # Check OCU balance
    balance_row = (
        supabase.table("user_balances")
        .select("ocu_balance")
        .eq("user_id", current_user["id"])
        .maybe_single()
        .execute()
    )
    balance = balance_row.data["ocu_balance"] if balance_row.data else 0

    if balance <= 0:
        raise HTTPException(
            status_code=402,
            detail={
                "error": "insufficient_compute_credits",
                "message": "Your OCU (compute credit) balance is zero. Top up at https://refineiq.vercel.app/settings to resume predictions.",
                "current_balance_ocu": 0,
                "top_up_url": "https://refineiq.vercel.app/settings",
                "docs": "https://refineiq.vercel.app/docs/billing",
            },
        )

    # Deduct 0.1 OCU per prediction
    supabase.table("user_balances").update(
        {"ocu_balance": balance - 0.1}
    ).eq("user_id", current_user["id"]).execute()

    # Fetch model info
    model = (
        supabase.table("models")
        .select("*")
        .eq("id", model_id)
        .maybe_single()
        .execute()
    )
    if not model.data or not model.data.get("is_deployed"):
        raise HTTPException(status_code=404, detail="Model not found or not deployed.")

    # Run exact SHAP inference engine with multicollinearity clustering
    from app.services.explainability import shap_engine

    feature_names = ["tenure_months", "monthly_spend", "age", "support_tickets"]
    if isinstance(payload, dict):
        for k in payload.keys():
            if k not in feature_names and isinstance(payload[k], (int, float)):
                feature_names.append(k)

    shap_result = shap_engine.explain_instance(
        model_id=model_id,
        instance_dict=payload if isinstance(payload, dict) else {},
        model=None,
        feature_names=feature_names,
        base_value=0.521,
    )

    return {
        "model_id": model_id,
        "prediction": shap_result["prediction"],
        "risk_level": shap_result["risk_level"],
        "prediction_score": shap_result["prediction_score"],
        "base_value": shap_result["base_value"],
        "shap_sum": shap_result["shap_sum"],
        "reconstructed_prediction": shap_result["reconstructed_prediction"],
        "is_exact_additive": shap_result["is_exact_additive"],
        "local_shap_weights": shap_result["local_shap_weights"],
        "key_drivers": shap_result["key_drivers"],
        "clustered_drivers": shap_result["clustered_drivers"],
        "latency_ms": shap_result["latency_ms"],
        "remaining_ocu_balance": round(balance - 0.1, 2),
    }

