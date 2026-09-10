from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.routers import projects, ingest, refinery, studio, deploy, monitor, feedback, billing


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    print(f"🚀 Analytics Hub API starting in {settings.APP_ENV} mode")
    yield
    print("🛑 Analytics Hub API shutting down")


app = FastAPI(
    title="Analytics Hub API",
    description="AI-native data science platform backend",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.APP_ENV == "development" else None,
    redoc_url="/redoc" if settings.APP_ENV == "development" else None,
)

# CORS — allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(ingest.router, prefix="/api/ingest", tags=["ingest"])
app.include_router(refinery.router, prefix="/api/refinery", tags=["refinery"])
app.include_router(studio.router, prefix="/api/studio", tags=["studio"])
app.include_router(deploy.router, prefix="/api/deploy", tags=["deploy"])
app.include_router(monitor.router, prefix="/api/monitor", tags=["monitor"])
app.include_router(feedback.router, prefix="/api/feedback", tags=["feedback"])
app.include_router(billing.router, prefix="/api/billing", tags=["billing"])


@app.get("/")
async def root():
    return {"message": "Analytics Hub API", "version": "0.1.0", "status": "healthy"}


@app.get("/health")
async def health_check():
    return {"status": "ok"}
