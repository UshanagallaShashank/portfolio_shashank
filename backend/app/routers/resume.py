from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from app.services.supabase_service import get_supabase_service
from app.middleware.auth import require_admin

router = APIRouter()


@router.get("/download")
async def download_resume():
    svc = get_supabase_service()
    resume = svc.get_active_resume()
    if not resume:
        raise HTTPException(status_code=404, detail="No active resume found")
    return RedirectResponse(url=resume["public_url"])


@router.get("", dependencies=[Depends(require_admin)])
async def list_resume_versions():
    svc = get_supabase_service()
    return svc.get_resume_versions()


@router.post("/{resume_id}/activate", dependencies=[Depends(require_admin)])
async def activate_resume(resume_id: str):
    svc = get_supabase_service()
    return svc.activate_resume(resume_id)
