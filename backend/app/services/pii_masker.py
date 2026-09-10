"""
PII Masking Service using Microsoft Presidio.

Usage:
    pip install presidio-analyzer presidio-anonymizer
    python -m spacy download en_core_web_lg
"""
import polars as pl
from typing import Optional

try:
    from presidio_analyzer import AnalyzerEngine
    from presidio_anonymizer import AnonymizerEngine
    _presidio_available = True
except ImportError:
    _presidio_available = False
    print("⚠️  Presidio not installed. Run: pip install presidio-analyzer presidio-anonymizer")

# PII entity types we scan for by default
DEFAULT_ENTITIES = [
    "EMAIL_ADDRESS",
    "PHONE_NUMBER",
    "CREDIT_CARD",
    "US_SSN",
    "PERSON",
    "IP_ADDRESS",
    "URL",
]

_analyzer = None
_anonymizer = None


def _get_engines():
    """Lazy-initialize Presidio engines (spaCy model loading is slow)."""
    global _analyzer, _anonymizer
    if _analyzer is None and _presidio_available:
        _analyzer = AnalyzerEngine()
        _anonymizer = AnonymizerEngine()
    return _analyzer, _anonymizer


def mask_text(text: str, entities: list[str] = DEFAULT_ENTITIES) -> tuple[str, list[str]]:
    """
    Mask PII in a single text string.
    Returns (masked_text, list_of_entity_types_found).
    """
    if not text or not isinstance(text, str):
        return text, []

    analyzer, anonymizer = _get_engines()
    if analyzer is None:
        return text, []

    results = analyzer.analyze(text=text, entities=entities, language="en")
    if not results:
        return text, []

    found_types = list({r.entity_type for r in results})
    anonymized = anonymizer.anonymize(text=text, analyzer_results=results)
    return anonymized.text, found_types


def mask_dataframe_pii(
    df: pl.DataFrame,
    columns: Optional[list[str]] = None,
    entities: list[str] = DEFAULT_ENTITIES,
) -> tuple[pl.DataFrame, dict]:
    """
    Scan and mask PII in all string columns (or specified columns) of a Polars DataFrame.

    Returns:
        (masked_df, pii_report)
        pii_report = {
            "columns_affected": int,
            "total_values_masked": int,
            "details": [{column, entity_types_found, values_masked}]
        }
    """
    if not _presidio_available:
        return df, {
            "columns_affected": 0,
            "total_values_masked": 0,
            "details": [],
            "warning": "Presidio not installed. PII masking skipped.",
        }

    # Determine which columns to scan
    if columns:
        target_cols = [c for c in columns if c in df.columns]
    else:
        # Auto-select string/categorical columns
        target_cols = [
            col for col in df.columns
            if df[col].dtype in (pl.Utf8, pl.String, pl.Categorical)
        ]

    total_masked = 0
    details = []
    df_result = df.clone()

    for col_name in target_cols:
        col_series = df_result[col_name]
        masked_values = []
        col_entity_types = set()
        col_masked_count = 0

        for val in col_series.to_list():
            if val is None:
                masked_values.append(None)
                continue
            masked_val, found_types = mask_text(str(val), entities)
            masked_values.append(masked_val)
            col_entity_types.update(found_types)
            if found_types:
                col_masked_count += 1

        if col_masked_count > 0:
            df_result = df_result.with_columns(
                pl.Series(name=col_name, values=masked_values)
            )
            total_masked += col_masked_count
            details.append({
                "column": col_name,
                "entity_types_found": list(col_entity_types),
                "values_masked": col_masked_count,
            })

    return df_result, {
        "columns_affected": len(details),
        "total_values_masked": total_masked,
        "details": details,
    }
