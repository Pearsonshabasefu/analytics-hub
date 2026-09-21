from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import json


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    # App
    APP_ENV: str = "development"
    APP_SECRET_KEY: str = "change-me-in-production"

    # Supabase
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str
    SUPABASE_ANON_KEY: str

    # Gemini AI
    GEMINI_API_KEY: str = ""

    # Modal
    MODAL_TOKEN_ID: str = ""
    MODAL_TOKEN_SECRET: str = ""

    # Resend (Email)
    RESEND_API_KEY: str = ""
    RESEND_FROM_EMAIL: str = "alerts@analyticshub.ai"

    # Payment Processing (Stripe / Multi-gateway)
    STRIPE_SECRET_KEY: str = ""
    STRIPE_PUBLISHABLE_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173"]

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"


settings = Settings()
