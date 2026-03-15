from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = "development"
    frontend_origin: str = "http://localhost:5173"

    # Supabase
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    supabase_jwt_secret: str = ""

    # GitHub
    github_token: str = ""
    github_username: str = "UshanagallaShashank"

    # Google AI / ADK
    google_api_key: str = ""
    google_adk_model: str = "gemini-2.5-flash-lite"

    # Email
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    notify_email: str = ""

    # n8n
    n8n_contact_webhook_url: str = ""
    n8n_github_sync_webhook_url: str = ""

    # Rate limiting
    rate_limit_chatbot: str = "10/minute"
    rate_limit_contact: str = "5/minute"


@lru_cache
def get_settings() -> Settings:
    return Settings()
