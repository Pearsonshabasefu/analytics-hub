from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from app.core.security import get_current_user
from app.core.supabase import get_supabase_admin

router = APIRouter()


class FeedbackRequest(BaseModel):
    frustration: str
    feature_request: Optional[str] = None
    screen: Optional[str] = None   # Which screen the user was on
    rating: Optional[int] = None   # 1-5


@router.post("/")
async def submit_feedback(
    payload: FeedbackRequest,
    current_user: dict = Depends(get_current_user),
):
    """Magic Ear: receive user feedback and store it."""
    supabase = get_supabase_admin()

    # Store feedback (create table in a future migration if needed)
    # For now, use a simple insert approach
    result = supabase.table("feedback").insert({
        "user_id": current_user["id"],
        "frustration": payload.frustration,
        "feature_request": payload.feature_request,
        "screen": payload.screen,
        "rating": payload.rating,
    }).execute()

    return {"success": True, "message": "Thank you! Your feedback has been recorded."}
