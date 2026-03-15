from functools import lru_cache
from supabase import create_client, Client
from app.config import get_settings


@lru_cache
def get_supabase() -> Client:
    settings = get_settings()
    key = settings.supabase_service_role_key or settings.supabase_anon_key
    return create_client(settings.supabase_url, key)
