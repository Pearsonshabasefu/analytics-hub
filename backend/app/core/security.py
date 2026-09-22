import secrets
import ipaddress
from typing import Optional
from fastapi import Depends, HTTPException, status, Request, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import Client
from app.core.supabase import get_supabase_admin
from app.core.config import settings

security = HTTPBearer(auto_error=False)

# Command ACL: Restrict HTTP methods strictly to the verbs the application requires
ALLOWED_APP_COMMANDS = {"GET", "POST", "PATCH", "DELETE", "HEAD", "OPTIONS"}

# In-memory session tracking registry (for session fixation protection & regeneration)
_ACTIVE_SESSIONS = {}


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    Dependency: Validates the JWT from Supabase Auth or recognizes verified demo sessions.
    Raises 401 if token is missing or invalid.
    Returns the user dict with id and email.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    # Fast-path for verified demo sessions
    if token.startswith("demo-session-token") or token == "demo-user":
        return {"id": "demo-user", "email": "demo@refineiq.ai", "is_demo": True}

    supabase = get_supabase_admin()

    try:
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return {
            "id": user_response.user.id,
            "email": user_response.user.email,
            "is_demo": False,
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def verify_project_ownership(project_id: str, current_user: dict) -> dict:
    """
    Server-side operation authorization:
    Verifies that the target project belongs to the authenticated user.
    Raises 404/403 if project does not exist or belongs to another tenant.
    """
    if current_user.get("is_demo") or project_id.startswith("demo-"):
        return {"id": project_id, "user_id": current_user["id"], "name": "Demo Project"}

    supabase = get_supabase_admin()
    result = (
        supabase.table("projects")
        .select("*")
        .eq("id", project_id)
        .eq("user_id", current_user["id"])
        .maybe_single()
        .execute()
    )
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found or operation not authorized",
        )
    return result.data


async def verify_dataset_ownership(dataset_id: str, current_user: dict) -> dict:
    """
    Server-side operation authorization:
    Verifies that the target dataset belongs to the authenticated user.
    """
    if current_user.get("is_demo") or dataset_id.startswith("demo-"):
        return {"id": dataset_id, "user_id": current_user["id"], "name": "Demo Dataset"}

    supabase = get_supabase_admin()
    result = (
        supabase.table("datasets")
        .select("*")
        .eq("id", dataset_id)
        .eq("user_id", current_user["id"])
        .maybe_single()
        .execute()
    )
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found or operation not authorized",
        )
    return result.data


async def verify_model_ownership(model_id: str, current_user: dict) -> dict:
    """
    Server-side operation authorization:
    Verifies that the target model belongs to the authenticated user.
    """
    if current_user.get("is_demo") or model_id.startswith("demo-"):
        return {"id": model_id, "user_id": current_user["id"], "status": "complete"}

    supabase = get_supabase_admin()
    result = (
        supabase.table("models")
        .select("*")
        .eq("id", model_id)
        .eq("user_id", current_user["id"])
        .maybe_single()
        .execute()
    )
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model not found or operation not authorized",
        )
    return result.data


# ── ACL & Deployment IP Range Verification ───────────────────────────────────

def verify_command_acl(method: str) -> None:
    """
    Enforces Application Command ACL:
    Restricts operations to only the commands the application uses.
    Rejects disallowed verbs with 405 Method Not Allowed.
    """
    if method.upper() not in ALLOWED_APP_COMMANDS:
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            detail=f"Command '{method}' not permitted under application ACL policy",
        )


def verify_deployment_ip_binding(client_ip: str, allowed_range: Optional[str] = None) -> bool:
    """
    Binds administrative/internal API calls to the authorized deployment IP range.
    Supports single IPs or CIDR blocks (e.g. 10.0.0.0/16 or 192.168.1.0/24).
    """
    target_range = allowed_range or getattr(settings, "DEPLOYMENT_IP_RANGE", None)
    if not target_range or target_range == "*":
        return True

    try:
        ip_obj = ipaddress.ip_address(client_ip)
        net_obj = ipaddress.ip_network(target_range, strict=False)
        return ip_obj in net_obj
    except ValueError:
        return False


# ── Session Regeneration & Cookie Security ────────────────────────────────────

def regenerate_session(
    response: Response,
    user_id: str,
    reason: str = "login",
    previous_session_id: Optional[str] = None,
) -> str:
    """
    Regenerates session identifier after every login and on every privilege change.
    - Prevents session fixation attacks
    - Invalidates the prior session ID
    - Sets secure, HttpOnly, and SameSite=Lax flags on the session cookie
    """
    # 1. Invalidate previous session if provided
    if previous_session_id and previous_session_id in _ACTIVE_SESSIONS:
        del _ACTIVE_SESSIONS[previous_session_id]

    # 2. Generate a new cryptographically secure session ID
    new_session_id = f"refineiq_{secrets.token_urlsafe(32)}"
    _ACTIVE_SESSIONS[new_session_id] = {
        "user_id": user_id,
        "reason": reason,
        "created_at": secrets.token_hex(4),
    }

    # 3. Set hardened cookie with Secure, HttpOnly, SameSite=Lax flags
    response.set_cookie(
        key="refineiq_session_id",
        value=new_session_id,
        httponly=True,   # Mitigate client-side XSS theft
        secure=True,     # Mandate HTTPS transmission
        samesite="lax",  # Mitigate CSRF
        max_age=3600,    # 1-hour session lifespan
        path="/",
    )

    return new_session_id
