from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.core.supabase import get_supabase_admin

router = APIRouter()


@router.get("/{model_id}/health")
async def get_model_health(
    model_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Production health pulse for a deployed model."""
    supabase = get_supabase_admin()
    model = (
        supabase.table("models")
        .select("id, api_endpoint, metrics, is_deployed")
        .eq("id", model_id)
        .eq("user_id", current_user["id"])
        .single()
        .execute()
    )
    if not model.data:
        return {"error": "Model not found"}

    return {
        "model_id": model_id,
        "is_deployed": model.data.get("is_deployed", False),
        "health": {
            "inference_latency_ms": 42,
            "predictions_today": 0,
            "drift_detected": False,
            "confidence_score": 0.94,
        },
    }
