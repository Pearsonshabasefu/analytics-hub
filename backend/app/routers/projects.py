from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from app.core.security import get_current_user
from app.core.supabase import get_supabase_admin
import uuid

router = APIRouter()


class CreateProjectRequest(BaseModel):
    name: str
    template: Optional[str] = None  # 'churn_prediction' | 'sales_forecasting' | None


class ProjectResponse(BaseModel):
    id: str
    name: str
    status: str
    template: Optional[str]
    created_at: str


@router.get("/", response_model=list[ProjectResponse])
async def list_projects(current_user: dict = Depends(get_current_user)):
    """List all projects for the authenticated user."""
    supabase = get_supabase_admin()
    result = (
        supabase.table("projects")
        .select("id, name, status, template, created_at")
        .eq("user_id", current_user["id"])
        .order("created_at", desc=True)
        .execute()
    )
    return result.data


@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    payload: CreateProjectRequest,
    current_user: dict = Depends(get_current_user),
):
    """Create a new project for the authenticated user."""
    supabase = get_supabase_admin()
    result = (
        supabase.table("projects")
        .insert({
            "user_id": current_user["id"],
            "name": payload.name,
            "template": payload.template,
            "status": "created",
        })
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create project")
    return result.data[0]


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Get a single project. RLS ensures users can only fetch their own."""
    supabase = get_supabase_admin()
    result = (
        supabase.table("projects")
        .select("id, name, status, template, created_at")
        .eq("id", project_id)
        .eq("user_id", current_user["id"])
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Project not found")
    return result.data


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Delete a project and all associated data."""
    supabase = get_supabase_admin()
    supabase.table("projects").delete().eq("id", project_id).eq(
        "user_id", current_user["id"]
    ).execute()
