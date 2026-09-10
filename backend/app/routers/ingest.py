from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import polars as pl
import io
from app.core.security import get_current_user
from app.core.supabase import get_supabase_admin

router = APIRouter()


class DatasetPreview(BaseModel):
    dataset_id: str
    row_count: int
    column_count: int
    columns: list[dict]   # [{name, type, sample_values, missing_pct}]
    sample_rows: list[dict]
    health_score: int


def _detect_health_score(df: pl.DataFrame) -> int:
    """
    Compute a simple health score (0-100) based on:
    - Missing value percentage (biggest factor)
    - Duplicate row percentage
    - Type consistency
    """
    total_cells = df.height * df.width
    if total_cells == 0:
        return 100

    missing_cells = sum(df[col].null_count() for col in df.columns)
    missing_pct = missing_cells / total_cells

    duplicate_pct = (df.height - df.unique().height) / df.height if df.height > 0 else 0

    score = 100 - int(missing_pct * 60) - int(duplicate_pct * 40)
    return max(0, min(100, score))


def _analyze_columns(df: pl.DataFrame) -> list[dict]:
    """Extract per-column metadata for the preview."""
    cols = []
    for col_name in df.columns:
        series = df[col_name]
        dtype = str(series.dtype)
        null_count = series.null_count()

        # Map Polars types to user-friendly labels
        if "Int" in dtype or "Float" in dtype:
            col_type = "Numerical"
        elif "Date" in dtype or "Datetime" in dtype:
            col_type = "DateTime"
        elif "Boolean" in dtype:
            col_type = "Boolean"
        else:
            col_type = "Categorical"

        sample = series.drop_nulls().head(3).to_list()

        cols.append({
            "name": col_name,
            "type": col_type,
            "polars_dtype": dtype,
            "missing_count": null_count,
            "missing_pct": round(null_count / df.height * 100, 1) if df.height > 0 else 0,
            "sample_values": [str(v) for v in sample],
        })
    return cols


@router.post("/upload", response_model=DatasetPreview)
async def upload_file(
    file: UploadFile = File(...),
    project_id: str = "",
    current_user: dict = Depends(get_current_user),
):
    """
    Upload a CSV or Excel file.
    1. Reads with Polars for fast parsing
    2. Analyzes columns + health score
    3. Stores raw file in Supabase Storage
    4. Creates a dataset record in DB
    Returns a preview for the UI.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    content = await file.read()
    filename_lower = file.filename.lower()

    # Parse with Polars
    try:
        if filename_lower.endswith(".csv"):
            df = pl.read_csv(io.BytesIO(content), infer_schema_length=1000)
        elif filename_lower.endswith((".xlsx", ".xls")):
            # Polars uses openpyxl under the hood for xlsx
            df = pl.read_excel(io.BytesIO(content))
        else:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file type. Please upload CSV or Excel files."
            )
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not parse file: {str(e)}")

    # Analyze
    health_score = _detect_health_score(df)
    columns = _analyze_columns(df)
    sample_rows = df.head(10).to_dicts()

    # Store file in Supabase Storage
    supabase = get_supabase_admin()
    storage_path = f"{current_user['id']}/{project_id}/{file.filename}"
    try:
        supabase.storage.from_("datasets").upload(
            path=storage_path,
            file=content,
            file_options={"content-type": file.content_type or "text/csv"},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Storage error: {str(e)}")

    # Create dataset record
    result = supabase.table("datasets").insert({
        "project_id": project_id or None,
        "user_id": current_user["id"],
        "name": file.filename,
        "source": "local",
        "storage_path": storage_path,
        "row_count": df.height,
        "column_count": df.width,
        "health_score": health_score,
    }).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to save dataset record")

    dataset_id = result.data[0]["id"]

    return DatasetPreview(
        dataset_id=dataset_id,
        row_count=df.height,
        column_count=df.width,
        columns=columns,
        sample_rows=sample_rows,
        health_score=health_score,
    )
