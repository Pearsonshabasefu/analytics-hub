# RefineIQ — Local Inference Docker Container

This container lets enterprise teams run RefineIQ models **100% locally** with no data leaving your network.

## Quick Start

```bash
# 1. Build the image
docker build -f Dockerfile.inference -t refineiq-inference .

# 2. Export your model from RefineIQ dashboard (Settings → Export → ONNX)
#    Place it in a local `models/` directory
mkdir models
cp /path/to/exported/champion.onnx models/

# 3. Run the container
docker run -p 8080:8080 \
  -v $(pwd)/models:/app/models \
  -e MODEL_PATH=/app/models/champion.onnx \
  refineiq-inference

# 4. Test
curl http://localhost:8080/health
curl -X POST http://localhost:8080/predict \
  -H "Content-Type: application/json" \
  -d '{"age": 34, "monthly_spend": 89.5, "tenure_months": 12}'
```

## Batch Predictions

```bash
curl -X POST http://localhost:8080/predict/batch \
  -H "Content-Type: application/json" \
  -d '[{"age": 34, "spend": 89.5}, {"age": 22, "spend": 12.0}]'
```

## Data Privacy

- All inference runs **inside your network**.
- No data is sent to RefineIQ servers.
- The ONNX model file contains only learned weights — no training data.

## Architecture

```
Your CRM / Data Warehouse
        ↓  POST /predict
  [Docker Container]
  ├─ FastAPI (port 8080)
  ├─ ONNX Runtime (CPU/GPU)
  └─ champion.onnx (your model weights)
        ↓
  prediction_score (returned JSON)
```
