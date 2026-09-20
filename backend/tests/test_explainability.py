"""
Tests for Exact TreeSHAP / KernelSHAP Engine & Hierarchical Clustering.
Validates:
1. Exact Shapley additivity: phi_0 + sum(phi_j) == f(x)
2. Multicollinearity detection and grouped credit (Pearson |r| > 0.8)
3. Sub-20ms inference latency for local explanation
4. Global SHAP dataset generation with Beeswarm coordinates
"""

import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import time
import numpy as np
from app.services.explainability import (
    HierarchicalFeatureClusterer,
    ExactShapEngine,
    shap_engine,
)


def test_exact_additivity():
    """
    Validates that the sum of local feature attributions plus the expected base value
    strictly equals the model prediction score: phi_0 + sum(phi_j) == f(x).
    """
    feature_names = ["age", "monthly_spend", "tenure_months", "support_tickets"]
    engine = ExactShapEngine()

    test_cases = [
        {"age": 28, "monthly_spend": 95.0, "tenure_months": 18, "support_tickets": 1},
        {"age": 55, "monthly_spend": 22.0, "tenure_months": 2, "support_tickets": 6},
        {"age": 42, "monthly_spend": 120.0, "tenure_months": 36, "support_tickets": 0},
        {"age": 70, "monthly_spend": 45.0, "tenure_months": 1, "support_tickets": 4},
    ]

    for case in test_cases:
        result = engine.explain_instance(
            model_id="test_model_exact",
            instance_dict=case,
            model=None,
            feature_names=feature_names,
            base_value=0.521,
        )

        base_val = result["base_value"]
        weights = result["local_shap_weights"]
        pred_score = result["prediction_score"]
        weight_sum = sum(weights.values())

        # Assert exact mathematical identity
        reconstructed = base_val + weight_sum
        assert abs(reconstructed - pred_score) < 1e-4, (
            f"Additivity violation: base_val ({base_val}) + sum(weights) ({weight_sum}) "
            f"= {reconstructed} != pred_score ({pred_score})"
        )
        assert result["is_exact_additive"] is True


def test_hierarchical_clustering_multicollinearity():
    """
    Validates that features with Pearson |r| > 0.8 are grouped into the same cluster,
    and their SHAP credits are aggregated in user-facing summaries.
    """
    np.random.seed(42)
    n_samples = 100

    # Create synthetic features where tenure_months and tenure_days are almost identical (r > 0.95)
    f_tenure_months = np.random.uniform(1, 48, n_samples)
    f_tenure_days = f_tenure_months * 30.4 + np.random.normal(0, 1, n_samples)  # r ~ 0.999
    f_monthly_spend = np.random.uniform(20, 200, n_samples)
    f_age = np.random.uniform(18, 70, n_samples)

    X = np.column_stack([f_tenure_months, f_tenure_days, f_monthly_spend, f_age])
    feature_names = ["tenure_months", "tenure_days", "monthly_spend", "age"]

    clusterer = HierarchicalFeatureClusterer(threshold=0.8)
    feature_to_cluster, cluster_details = clusterer.cluster_features(X, feature_names)

    # tenure_months and tenure_days MUST be in the same cluster
    assert feature_to_cluster["tenure_months"] == feature_to_cluster["tenure_days"], (
        "Collinear features (r > 0.99) were not placed in the same cluster!"
    )

    # Monthly spend and age should NOT be in the same cluster as tenure
    assert feature_to_cluster["monthly_spend"] != feature_to_cluster["tenure_months"]
    assert feature_to_cluster["age"] != feature_to_cluster["tenure_months"]

    # Verify cluster details
    collinear_clusters = [c for c in cluster_details if c["is_collinear"]]
    assert len(collinear_clusters) >= 1
    found_tenure_cluster = False
    for c in collinear_clusters:
        if "tenure_months" in c["features"] and "tenure_days" in c["features"]:
            found_tenure_cluster = True
            assert c["max_abs_r"] > 0.95
    assert found_tenure_cluster is True

    # Test driver generation with clustered features
    engine = ExactShapEngine()
    engine.compute_global_dataset("test_collinear_model", None, X, feature_names)

    instance = {"tenure_months": 36, "tenure_days": 1095, "monthly_spend": 150, "age": 40}
    res = engine.explain_instance(
        model_id="test_collinear_model",
        instance_dict=instance,
        model=None,
        feature_names=feature_names,
    )

    # The drivers must contain a Collinear Group bullet
    has_collinear_group = any("Collinear Group" in d for d in res["key_drivers"])
    assert has_collinear_group is True, f"Key drivers did not group collinear features: {res['key_drivers']}"


def test_inference_latency_sub_20ms():
    """
    Validates that explain_instance executes in < 20ms to power real-time APIs.
    """
    feature_names = ["age", "monthly_spend", "tenure_months", "support_tickets", "contract_type"]
    engine = ExactShapEngine()

    instance = {
        "age": 34,
        "monthly_spend": 89.5,
        "tenure_months": 12,
        "support_tickets": 2,
        "contract_type": 1,
    }

    # Warmup
    engine.explain_instance("test_latency_model", instance, None, feature_names)

    # Measure 100 runs
    latencies = []
    for _ in range(100):
        t0 = time.perf_counter()
        engine.explain_instance("test_latency_model", instance, None, feature_names)
        latencies.append((time.perf_counter() - t0) * 1000)

    p95 = np.percentile(latencies, 95)
    mean_lat = np.mean(latencies)

    print(f"\nExplainability Latency: Mean = {mean_lat:.2f}ms, P95 = {p95:.2f}ms")
    assert p95 < 20.0, f"P95 latency was {p95:.2f}ms, expected < 20ms"


def test_global_shap_dataset_generation():
    """
    Validates that compute_global_dataset returns a valid payload for Studio dashboards
    with beeswarm points, mean absolute SHAP ranking, and plain-English summary.
    """
    np.random.seed(123)
    n = 50
    X = np.random.randn(n, 5)
    feature_names = ["feat_a", "feat_b", "feat_c", "feat_d", "feat_e"]

    engine = ExactShapEngine()
    global_data = engine.compute_global_dataset("test_global_model", None, X, feature_names)

    assert "base_value" in global_data
    assert "mean_abs_shap" in global_data
    assert len(global_data["mean_abs_shap"]) == 5
    assert "beeswarm_data" in global_data
    assert len(global_data["beeswarm_data"]) > 0
    assert "feature_clusters" in global_data
    assert "plain_english_summary" in global_data

    # Check beeswarm data point structure
    pt = global_data["beeswarm_data"][0]
    assert "feature" in pt
    assert "shap_value" in pt
    assert "feature_value" in pt
    assert "feature_value_norm" in pt
    assert 0.0 <= pt["feature_value_norm"] <= 1.0


if __name__ == "__main__":
    print("Testing Exact Additivity...")
    test_exact_additivity()
    print("Testing Multicollinearity Hierarchical Clustering...")
    test_hierarchical_clustering_multicollinearity()
    print("Testing Sub-20ms Inference Latency...")
    test_inference_latency_sub_20ms()
    print("Testing Global SHAP Dataset Generation...")
    test_global_shap_dataset_generation()
    print("\n>>> ALL TESTS PASSED SUCCESSFULLY! <<<")

