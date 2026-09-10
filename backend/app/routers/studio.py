from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
from app.core.security import get_current_user
from app.core.supabase import get_supabase_admin
from app.services.gemini_guide import get_model_explanation

router = APIRouter()


class TrainRequest(BaseModel):
    dataset_id: str
    target_column: str
    strategy: str = "fast"  # 'fast' | 'high_accuracy'
    max_ocu_spend: Optional[int] = 20


class TrainResponse(BaseModel):
    job_id: str
    models_queued: list[str]
    estimated_ocu_cost: float
    estimated_time_seconds: int
    message: str


@router.post("/{project_id}/train", response_model=TrainResponse)
async def start_training(
    project_id: str,
    payload: TrainRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
):
    """
    Dispatch AutoML training jobs on Modal.
    Fast strategy: Logistic Regression, Random Forest, XGBoost (3 models)
    High Accuracy: adds LightGBM + deep ensembles
    """
    supabase = get_supabase_admin()

    # Verify project ownership
    project = supabase.table("projects").select("id").eq("id", project_id).eq("user_id", current_user["id"]).single().execute()
    if not project.data:
        raise HTTPException(status_code=404, detail="Project not found")

    # Determine which algorithms to train
    if payload.strategy == "fast":
        algorithms = ["logistic_regression", "random_forest", "xgboost"]
        estimated_ocu = 3.5
        estimated_time = 90
    else:
        algorithms = ["random_forest", "xgboost", "lightgbm"]
        estimated_ocu = 8.0
        estimated_time = 300

    # Create model records (status: queued)
    model_ids = []
    for algo in algorithms:
        result = supabase.table("models").insert({
            "project_id": project_id,
            "user_id": current_user["id"],
            "dataset_id": payload.dataset_id,
            "name": f"{algo.replace('_', ' ').title()}",
            "algorithm": algo,
            "target_column": payload.target_column,
            "strategy": payload.strategy,
            "status": "queued",
            "ocu_estimated": estimated_ocu / len(algorithms),
        }).execute()
        if result.data:
            model_ids.append(result.data[0]["id"])

    # Update project status
    supabase.table("projects").update({"status": "modeling"}).eq("id", project_id).execute()

    # TODO: background_tasks.add_task(dispatch_modal_training, model_ids, payload)

    return TrainResponse(
        job_id=f"job_{project_id[:8]}",
        models_queued=algorithms,
        estimated_ocu_cost=estimated_ocu,
        estimated_time_seconds=estimated_time,
        message=f"Training {len(algorithms)} models. Check /leaderboard for live progress.",
    )


@router.get("/{project_id}/leaderboard")
async def get_leaderboard(
    project_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Get the model leaderboard with training status and metrics."""
    supabase = get_supabase_admin()
    result = (
        supabase.table("models")
        .select("id, name, algorithm, status, metrics, feature_importance, is_champion, ocu_cost, ocu_estimated, gemini_explanation, created_at")
        .eq("project_id", project_id)
        .eq("user_id", current_user["id"])
        .order("created_at", desc=False)
        .execute()
    )
    return {"models": result.data}
