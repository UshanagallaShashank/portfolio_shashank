from fastapi import HTTPException, status
from supabase import create_client
from app.config import get_settings


def verify_supabase_token(token: str) -> dict:
    settings = get_settings()
    try:
        client = create_client(settings.supabase_url, settings.supabase_anon_key)
        response = client.auth.get_user(token)
        user = response.user
        if not user:
            raise ValueError("No user returned")
        return {"sub": user.id, "email": user.email, "role": "authenticated"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e
