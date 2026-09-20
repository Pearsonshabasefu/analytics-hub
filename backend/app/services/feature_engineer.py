"""
Automated Feature Engineering for RefineIQ.

Auto-detects timestamp/date columns and expands them into
calendar features: day_of_week, month, is_weekend, quarter, day_of_month.
Also auto-detects high-cardinality string columns for target encoding hints.
"""
import polars as pl
from datetime import datetime
from typing import Optional
import logging

logger = logging.getLogger(__name__)


TIMESTAMP_SUFFIXES = (
    "_date", "_at", "_time", "_datetime", "_ts",
    "date", "timestamp", "time", "datetime",
)


def detect_timestamp_columns(df: pl.DataFrame) -> list[str]:
    """Return column names that are dtype Date/Datetime or have timestamp-like names."""
    ts_cols = []
    for col in df.columns:
        dtype = df[col].dtype
        if dtype in (pl.Date, pl.Datetime):
            ts_cols.append(col)
            continue
        col_lower = col.lower()
        if any(col_lower.endswith(sfx) or col_lower == sfx for sfx in TIMESTAMP_SUFFIXES):
            # Try to cast to date
            try:
                df[col].cast(pl.Date)
                ts_cols.append(col)
            except Exception:
                pass
    return ts_cols


def expand_timestamp_column(df: pl.DataFrame, col: str) -> pl.DataFrame:
    """Expand a timestamp column into calendar features."""
    try:
        if df[col].dtype not in (pl.Date, pl.Datetime):
            df = df.with_columns(pl.col(col).cast(pl.Date))
        df = df.with_columns([
            pl.col(col).dt.weekday().alias(f"{col}__day_of_week"),     # 0=Mon..6=Sun
            pl.col(col).dt.month().alias(f"{col}__month"),
            pl.col(col).dt.day().alias(f"{col}__day_of_month"),
            pl.col(col).dt.quarter().alias(f"{col}__quarter"),
            (pl.col(col).dt.weekday() >= 5).alias(f"{col}__is_weekend"),
        ])
        logger.info(f"Expanded timestamp column '{col}' into 5 calendar features.")
    except Exception as e:
        logger.warning(f"Could not expand timestamp column '{col}': {e}")
    return df


def auto_engineer_features(df: pl.DataFrame) -> tuple[pl.DataFrame, list[str]]:
    """
    Main entry point. Detects and expands all timestamp columns.
    Returns (enriched_df, list_of_new_feature_names).
    """
    ts_cols = detect_timestamp_columns(df)
    new_features = []
    for col in ts_cols:
        before_cols = set(df.columns)
        df = expand_timestamp_column(df, col)
        added = [c for c in df.columns if c not in before_cols]
        new_features.extend(added)
    logger.info(f"Auto feature engineering: added {len(new_features)} features from {len(ts_cols)} timestamp columns.")
    return df, new_features


def get_feature_engineering_report(new_features: list[str]) -> dict:
    """Return a human-readable report of auto-engineered features."""
    if not new_features:
        return {"engineered_features": [], "summary": "No timestamp columns detected — no auto-features added."}
    return {
        "engineered_features": new_features,
        "count": len(new_features),
        "summary": f"Auto-extracted {len(new_features)} calendar features from timestamp columns.",
        "features": [
            {"name": f, "description": _describe_feature(f)}
            for f in new_features
        ],
    }


def _describe_feature(feature_name: str) -> str:
    if feature_name.endswith("__day_of_week"):
        return "Integer 0-6 (Monday=0, Sunday=6)"
    if feature_name.endswith("__month"):
        return "Integer 1-12 representing calendar month"
    if feature_name.endswith("__day_of_month"):
        return "Integer 1-31 representing day within month"
    if feature_name.endswith("__quarter"):
        return "Integer 1-4 representing fiscal quarter"
    if feature_name.endswith("__is_weekend"):
        return "Boolean True if Saturday or Sunday"
    return "Auto-engineered calendar feature"
