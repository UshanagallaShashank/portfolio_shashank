from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from supabase import create_client
from app.config import get_settings
from app.middleware.auth import require_admin
from app.services.supabase_service import get_supabase_service

router = APIRouter()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/login")
async def admin_login(body: LoginRequest):
    settings = get_settings()
    client = create_client(settings.supabase_url, settings.supabase_anon_key)
    try:
        res = client.auth.sign_in_with_password({"email": body.email, "password": body.password})
        if not res.session:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        return {"access_token": res.session.access_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials") from e


@router.get("/dashboard")
async def dashboard(admin: dict = Depends(require_admin)):
    svc = get_supabase_service()
    return svc.get_dashboard_stats()
