from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import polars as pl
import io
from app.core.security import get_current_user
from app.core.supabase import get_supabase_admin
from app.services.pii_masker import mask_dataframe_pii
from app.services.data_processor import (
    compute_health_report,
    apply_fix,
)

router = APIRouter()


class HealthReport(BaseModel):
    dataset_id: str
    health_score: int
    issues: list[dict]   # [{type, column, count, description, suggestion}]
    column_stats: list[dict]


class FixRequest(BaseModel):
    fix_type: str   # 'impute_median' | 'impute_mean' | 'drop_nulls' | 'drop_duplicates' | 'mask_pii'
    column: Optional[str] = None
    params: Optional[dict] = None


class MaskPIIRequest(BaseModel):
    columns: Optional[list[str]] = None  # None = auto-detect all columns


@router.get("/{dataset_id}/health", response_model=HealthReport)
async def get_health(
    dataset_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Run health analysis on a dataset.
    Returns health score (0-100) + list of issues with AI-suggested fixes.
    """
    supabase = get_supabase_admin()

    # Fetch dataset record
    record = (
        supabase.table("datasets")
        .select("*")
        .eq("id", dataset_id)
        .eq("user_id", current_user["id"])
        .single()
        .execute()
    )
    if not record.data:
        raise HTTPException(status_code=404, detail="Dataset not found")

    # Download file from Supabase Storage
    storage_path = record.data["storage_path"]
    file_bytes = supabase.storage.from_("datasets").download(storage_path)
    df = pl.read_csv(io.BytesIO(file_bytes))

    # Compute health report
    report = compute_health_report(df)
    return HealthReport(dataset_id=dataset_id, **report)


@router.post("/{dataset_id}/fix")
async def apply_dataset_fix(
    dataset_id: str,
    payload: FixRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Apply a cleaning fix to the dataset.
    Stores the action in the cleaning recipe JSONB column.
    """
    supabase = get_supabase_admin()

    # Fetch + verify ownership
    record = (
        supabase.table("datasets")
        .select("*")
        .eq("id", dataset_id)
        .eq("user_id", current_user["id"])
        .single()
        .execute()
    )
    if not record.data:
        raise HTTPException(status_code=404, detail="Dataset not found")

    # Download and parse
    file_bytes = supabase.storage.from_("datasets").download(record.data["storage_path"])
    df = pl.read_csv(io.BytesIO(file_bytes))

    # Apply the fix
    df_fixed, step_description = apply_fix(df, payload.fix_type, payload.column, payload.params)

    # Save fixed CSV back to storage
    fixed_bytes = df_fixed.write_csv().encode()
    supabase.storage.from_("datasets").update(
        path=record.data["storage_path"],
        file=fixed_bytes,
        file_options={"content-type": "text/csv"},
    )

    # Append step to cleaning recipe
    current_recipe = record.data.get("cleaning_recipe") or []
    current_recipe.append({
        "step": len(current_recipe) + 1,
        "action": payload.fix_type,
        "column": payload.column,
        "description": step_description,
        "status": "applied",
    })

    # Recompute health score
    new_score = compute_health_report(df_fixed)["health_score"]

    supabase.table("datasets").update({
        "cleaning_recipe": current_recipe,
        "health_score": new_score,
        "row_count": df_fixed.height,
    }).eq("id", dataset_id).execute()

    return {
        "success": True,
        "description": step_description,
        "new_health_score": new_score,
        "recipe_step": len(current_recipe),
    }


@router.post("/{dataset_id}/mask-pii")
async def mask_pii(
    dataset_id: str,
    payload: MaskPIIRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Run Microsoft Presidio PII detection and masking on the dataset.
    Scans all text columns (or specified ones) for emails, phones, credit cards, etc.
    Returns a report of what was found and masked.
    """
    supabase = get_supabase_admin()

    record = (
        supabase.table("datasets")
        .select("*")
        .eq("id", dataset_id)
        .eq("user_id", current_user["id"])
        .single()
        .execute()
    )
    if not record.data:
        raise HTTPException(status_code=404, detail="Dataset not found")

    file_bytes = supabase.storage.from_("datasets").download(record.data["storage_path"])
    df = pl.read_csv(io.BytesIO(file_bytes))

    # Run PII masking
    df_masked, pii_report = mask_dataframe_pii(df, columns=payload.columns)

    # Save masked version
    masked_bytes = df_masked.write_csv().encode()
    supabase.storage.from_("datasets").update(
        path=record.data["storage_path"],
        file=masked_bytes,
        file_options={"content-type": "text/csv"},
    )

    # Mark dataset as PII-masked
    supabase.table("datasets").update({"pii_masked": True}).eq("id", dataset_id).execute()

    return {
        "success": True,
        "pii_report": pii_report,
        "message": f"Masked PII in {pii_report['columns_affected']} column(s). {pii_report['total_values_masked']} values redacted.",
    }


@router.get("/{dataset_id}/recipe")
async def get_recipe(
    dataset_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Return the ordered cleaning recipe for a dataset."""
    supabase = get_supabase_admin()
    record = (
        supabase.table("datasets")
        .select("cleaning_recipe, pii_masked, health_score")
        .eq("id", dataset_id)
        .eq("user_id", current_user["id"])
        .single()
        .execute()
    )
    if not record.data:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return record.data
