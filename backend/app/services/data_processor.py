"""
Data processing service using Polars.
Handles health score computation and cleaning operations.
"""
import polars as pl
from typing import Optional, Any


def compute_health_report(df: pl.DataFrame) -> dict:
    """
    Analyze a DataFrame and return a health report.

    Returns:
        {
            health_score: int (0-100),
            issues: list of issue dicts,
            column_stats: list of column stat dicts
        }
    """
    issues = []
    total_rows = df.height

    # --- Missing Value Analysis ---
    for col in df.columns:
        null_count = df[col].null_count()
        if null_count > 0:
            pct = round(null_count / total_rows * 100, 1) if total_rows else 0
            dtype = str(df[col].dtype)
            is_numeric = "Int" in dtype or "Float" in dtype

            issues.append({
                "type": "missing_values",
                "column": col,
                "count": null_count,
                "description": f"Found {null_count} empty values in '{col}' ({pct}% of rows)",
                "suggestion": (
                    f"I recommend replacing empty '{col}' values with the median"
                    if is_numeric
                    else f"I recommend dropping rows with missing '{col}' values"
                ),
                "fix_type": "impute_median" if is_numeric else "drop_nulls",
            })

    # --- Duplicate Row Analysis ---
    duplicate_count = total_rows - df.unique().height
    if duplicate_count > 0:
        issues.append({
            "type": "duplicates",
            "column": None,
            "count": duplicate_count,
            "description": f"Found {duplicate_count} duplicate rows",
            "suggestion": "I recommend removing all duplicate rows",
            "fix_type": "drop_duplicates",
        })

    # --- Outlier Detection (numerical columns only) ---
    for col in df.columns:
        series = df[col]
        dtype = str(series.dtype)
        if "Int" not in dtype and "Float" not in dtype:
            continue
        try:
            q1 = series.quantile(0.25)
            q3 = series.quantile(0.75)
            if q1 is None or q3 is None:
                continue
            iqr = q3 - q1
            lower = q1 - 1.5 * iqr
            upper = q3 + 1.5 * iqr
            outlier_count = series.filter(
                (series < lower) | (series > upper)
            ).len()
            if outlier_count > 0:
                issues.append({
                    "type": "outliers",
                    "column": col,
                    "count": int(outlier_count),
                    "description": f"Found {outlier_count} outliers in '{col}' (IQR method)",
                    "suggestion": f"Filter values outside [{round(lower, 2)}, {round(upper, 2)}]",
                    "fix_type": "filter_outliers",
                })
        except Exception:
            pass

    # --- Compute Health Score ---
    total_cells = total_rows * df.width if df.width > 0 else 1
    missing_cells = sum(df[c].null_count() for c in df.columns)
    missing_pct = missing_cells / total_cells

    dup_pct = duplicate_count / total_rows if total_rows > 0 else 0
    outlier_penalty = min(0.1, sum(
        i["count"] / total_rows for i in issues if i["type"] == "outliers"
    ))

    score = 100 - int(missing_pct * 55) - int(dup_pct * 30) - int(outlier_penalty * 15)
    health_score = max(0, min(100, score))

    # --- Column Stats ---
    column_stats = []
    for col in df.columns:
        series = df[col]
        dtype = str(series.dtype)
        stat = {
            "name": col,
            "type": _map_type(dtype),
            "null_count": series.null_count(),
            "null_pct": round(series.null_count() / total_rows * 100, 1) if total_rows else 0,
        }
        if "Int" in dtype or "Float" in dtype:
            non_null = series.drop_nulls()
            if non_null.len() > 0:
                stat["min"] = non_null.min()
                stat["max"] = non_null.max()
                stat["mean"] = round(non_null.mean(), 2)
                stat["median"] = non_null.median()
        column_stats.append(stat)

    return {
        "health_score": health_score,
        "issues": issues,
        "column_stats": column_stats,
    }


def _map_type(dtype: str) -> str:
    if "Int" in dtype or "Float" in dtype:
        return "Numerical"
    if "Date" in dtype or "Datetime" in dtype:
        return "DateTime"
    if "Boolean" in dtype:
        return "Boolean"
    return "Categorical"


def apply_fix(
    df: pl.DataFrame,
    fix_type: str,
    column: Optional[str],
    params: Optional[dict],
) -> tuple[pl.DataFrame, str]:
    """
    Apply a single cleaning fix to the DataFrame.
    Returns (fixed_df, human_readable_description).
    """
    if fix_type == "impute_median" and column:
        median_val = df[column].median()
        df = df.with_columns(
            pl.col(column).fill_null(median_val)
        )
        return df, f"Filled {column} missing values with median ({round(median_val, 2)})"

    elif fix_type == "impute_mean" and column:
        mean_val = df[column].mean()
        df = df.with_columns(
            pl.col(column).fill_null(mean_val)
        )
        return df, f"Filled {column} missing values with mean ({round(mean_val, 2)})"

    elif fix_type == "drop_nulls" and column:
        before = df.height
        df = df.filter(pl.col(column).is_not_null())
        removed = before - df.height
        return df, f"Removed {removed} rows with null values in '{column}'"

    elif fix_type == "drop_duplicates":
        before = df.height
        df = df.unique()
        removed = before - df.height
        return df, f"Removed {removed} duplicate rows"

    elif fix_type == "filter_outliers" and column:
        q1 = df[column].quantile(0.25)
        q3 = df[column].quantile(0.75)
        iqr = q3 - q1
        lower = q1 - 1.5 * iqr
        upper = q3 + 1.5 * iqr
        before = df.height
        df = df.filter((pl.col(column) >= lower) & (pl.col(column) <= upper))
        removed = before - df.height
        return df, f"Removed {removed} outliers from '{column}' (range: {round(lower, 2)} – {round(upper, 2)})"

    elif fix_type == "fill_value" and column and params and "value" in params:
        val = params["value"]
        df = df.with_columns(pl.col(column).fill_null(val))
        return df, f"Filled missing values in '{column}' with '{val}'"

    else:
        raise ValueError(f"Unknown fix_type: {fix_type}")
