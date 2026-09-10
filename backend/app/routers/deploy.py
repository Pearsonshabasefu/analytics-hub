from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
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
