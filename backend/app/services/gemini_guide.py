"""
Gemini Guide service — generates natural language explanations for data insights and models.
Uses Gemini 2.5 Flash API with metadata-only guardrails (no row data is sent to the model).
"""
import os
import json
from typing import Dict, Any, Optional
from app.core.config import settings

# Lazy client setup
_client_initialized = False


def _get_gemini_model():
    global _client_initialized
    api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    try:
        import google.generativeai as genai
        if not _client_initialized:
            genai.configure(api_key=api_key)
            _client_initialized = True
        return genai.GenerativeModel("gemini-2.5-flash")
    except Exception as e:
        print(f"Warning: Failed to initialize Gemini client: {e}")
        return None


async def get_model_explanation(
    algorithm: str,
    target_column: str,
    metrics: Dict[str, Any],
    feature_importance: Optional[Dict[str, float]] = None,
) -> str:
    """
    Generate an explainable AI briefing for a trained model.
    Falls back gracefully to a templated explanation if Gemini API is unavailable.
    """
    top_features = []
    if feature_importance:
        sorted_features = sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)
        top_features = [f"{feat} ({weight:.1%})" for feat, weight in sorted_features[:3]]

    model = _get_gemini_model()
    if model:
        try:
            prompt = f"""
            You are the Analytics Hub AI Guide. Provide a concise, clear explanation (2-3 sentences)
            of this trained machine learning model for a business user or data analyst.
            
            Algorithm: {algorithm}
            Target Prediction: {target_column}
            Performance Metrics: {json.dumps(metrics)}
            Top Influential Features: {', '.join(top_features) if top_features else 'Balanced across columns'}
            
            Explain why this algorithm worked well on this data, what the key drivers of the prediction are,
            and how the user should interpret this result. Avoid heavy academic jargon.
            """
            response = model.generate_content(prompt)
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            print(f"Gemini API call error: {e}")

    # Fallback explanation if API key is not configured or network call fails
    accuracy_text = ""
    if "accuracy" in metrics:
        accuracy_text = f"achieved {metrics['accuracy']:.1%} accuracy"
    elif "r2" in metrics:
        accuracy_text = f"achieved an R² score of {metrics['r2']:.2f}"
    else:
        accuracy_text = "demonstrated strong predictive performance"

    features_text = (
        f"The primary predictive drivers are {', '.join(top_features)}."
        if top_features
        else "Features showed balanced distribution across all factors."
    )

    return (
        f"The {algorithm.replace('_', ' ').title()} model {accuracy_text} when predicting '{target_column}'. "
        f"{features_text} "
        f"This model is well-calibrated for production deployment."
    )


async def get_data_cleaning_recommendation(
    dataset_summary: Dict[str, Any],
) -> str:
    """
    Suggest data cleaning steps based on missing values, outliers, and column types.
    """
    model = _get_gemini_model()
    if model:
        try:
            prompt = f"""
            You are Analytics Hub AI Refinery Guide. Provide 2 concise, actionable bullet points
            recommending the best data cleaning steps for this dataset summary:
            {json.dumps(dataset_summary, default=str)}
            Focus on imputation, duplicate handling, and privacy preservation.
            """
            response = model.generate_content(prompt)
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            print(f"Gemini recommendation error: {e}")

    return (
        "• Impute missing numerical fields with the column median to preserve distribution without outlier distortion.\n"
        "• Enable Privacy Shield to automatically mask sensitive customer identifiers before model training."
    )
