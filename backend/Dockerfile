FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

WORKDIR /app

# Install system runtime dependencies for XGBoost & LightGBM
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY pyproject.toml .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir \
    fastapi==0.115.0 \
    "uvicorn[standard]==0.32.0" \
    python-multipart==0.0.12 \
    pydantic==2.10.3 \
    pydantic-settings==2.7.0 \
    supabase==2.10.0 \
    polars==1.17.1 \
    scikit-learn==1.6.0 \
    scipy==1.14.1 \
    numpy==2.2.0 \
    shap==0.46.0 \
    httpx==0.28.1 \
    python-dotenv==1.0.1

# Download en_core_web_sm for NLP / Presidio if needed
RUN python -m pip install --no-cache-dir presidio-analyzer==2.2.355 presidio-anonymizer==2.2.355 || true

# Copy application code
COPY . .

# Expose server port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Start production server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
