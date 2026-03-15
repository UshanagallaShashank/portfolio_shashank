import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import RedirectResponse
from supabase import create_client
from app.services.supabase_service import get_supabase_service
from app.middleware.auth import require_admin
from app.dependencies import get_supabase
from app.config import get_settings

router = APIRouter()
BUCKET = "resumes"


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


@router.post("/upload", dependencies=[Depends(require_admin)])
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10 MB)")

    unique_name = f"{uuid.uuid4().hex}_{file.filename}"

    # Use anon key for storage — upload is protected at the API level by require_admin
    settings = get_settings()
    storage_client = create_client(settings.supabase_url, settings.supabase_anon_key)

    try:
        storage_client.storage.from_(BUCKET).upload(unique_name, content, {"content-type": "application/pdf"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Storage upload failed: {str(e)}")

    public_url = storage_client.storage.from_(BUCKET).get_public_url(unique_name)

    svc = get_supabase_service()
    version = svc.create_resume_version({
        "file_name": file.filename,
        "storage_path": unique_name,
        "public_url": public_url,
        "is_active": False,
    })
    return version


@router.post("/{resume_id}/activate", dependencies=[Depends(require_admin)])
async def activate_resume(resume_id: str):
    svc = get_supabase_service()
    return svc.activate_resume(resume_id)


@router.delete("/{resume_id}", dependencies=[Depends(require_admin)])
async def delete_resume(resume_id: str):
    svc = get_supabase_service()
    version = svc.get_resume_version(resume_id)
    if not version:
        raise HTTPException(status_code=404, detail="Resume version not found")

    settings = get_settings()
    storage_client = create_client(settings.supabase_url, settings.supabase_anon_key)
    try:
        storage_client.storage.from_(BUCKET).remove([version["storage_path"]])
    except Exception:
        pass

    svc.delete_resume_version(resume_id)
    return {"ok": True}
