from fastapi import APIRouter
from app.config import get_settings

router = APIRouter()


@router.get("/health", tags=["health"])
async def health_check():
    settings = get_settings()
    return {
        "status": "ok",
        "env": settings.app_env,
        "version": "1.0.0",
    }
