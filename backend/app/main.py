from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.routers import projects, ingest, refinery, studio, deploy, monitor, feedback, billing


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    print(f"🚀 RefineIQ API starting in {settings.APP_ENV} mode")
    yield
    print("🛑 RefineIQ API shutting down")


app = FastAPI(
    title="RefineIQ API",
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

from app.core.security import verify_command_acl, verify_deployment_ip_binding
from fastapi.responses import JSONResponse

# Command ACL & Deployment IP Binding Middleware
@app.middleware("http")
async def enforce_command_acl_and_ip_binding(request, call_next):
    # 1. Enforce Command ACL: Only allow verbs the app actually uses
    verify_command_acl(request.method)

    # 2. Enforce Deployment IP Binding for internal/cluster calls if configured
    client_ip = request.client.host if request.client else "127.0.0.1"
    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        client_ip = forwarded_for.split(",")[0].strip()

    if not verify_deployment_ip_binding(client_ip):
        return JSONResponse(
            status_code=403,
            content={"detail": "Access forbidden: IP not in authorized deployment range"},
        )

    return await call_next(request)

# Server-side Security Headers Middleware (OWASP recommended)
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Content-Security-Policy"] = "frame-ancestors 'none';"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), camera=(), microphone=()"
    return response

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
    return {"message": "RefineIQ API", "version": "0.1.0", "status": "healthy"}


@app.get("/health")
async def health_check():
    return {"status": "ok"}
