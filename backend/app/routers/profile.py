import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from supabase import create_client
from app.services.supabase_service import get_supabase_service
from app.middleware.auth import require_admin
from app.config import get_settings

router = APIRouter()
BUCKET = "avatars"
ALLOWED_EXTS = (".jpg", ".jpeg", ".png", ".webp", ".gif")
SECTIONS = ("hero", "about")


@router.get("")
async def get_profile():
    svc = get_supabase_service()
    return svc.get_settings_dict()


@router.patch("", dependencies=[Depends(require_admin)])
async def update_profile(body: dict):
    svc = get_supabase_service()
    for key, value in body.items():
        svc.upsert_setting(key, str(value))
    return svc.get_settings_dict()


# ── Photo list & upload ─────────────────────────────────────────────────────────

@router.get("/photos", dependencies=[Depends(require_admin)])
async def list_photos():
    svc = get_supabase_service()
    return svc.get_profile_photos()


@router.post("/photos/upload", dependencies=[Depends(require_admin)])
async def upload_photo(file: UploadFile = File(...)):
    if not file.filename or not any(file.filename.lower().endswith(ext) for ext in ALLOWED_EXTS):
        raise HTTPException(status_code=400, detail="Only image files (JPG, PNG, WebP, GIF) are allowed")

    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 5 MB)")

    ext = file.filename.rsplit(".", 1)[-1].lower()
    unique_name = f"avatar_{uuid.uuid4().hex}.{ext}"
    content_type = file.content_type or f"image/{ext}"

    cfg = get_settings()
    storage_key = cfg.supabase_service_role_key or cfg.supabase_anon_key
    storage_client = create_client(cfg.supabase_url, storage_key)

    try:
        storage_client.storage.from_(BUCKET).upload(unique_name, content, {"content-type": content_type})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Storage upload failed: {str(e)}")

    public_url = storage_client.storage.from_(BUCKET).get_public_url(unique_name)

    svc = get_supabase_service()
    photo = svc.create_profile_photo({
        "storage_path": unique_name,
        "public_url": public_url,
        "is_active": False,
    })
    return photo


# ── Assign photo to a section ───────────────────────────────────────────────────

@router.post("/photos/{photo_id}/assign/{section}", dependencies=[Depends(require_admin)])
async def assign_photo(photo_id: str, section: str):
    if section not in SECTIONS:
        raise HTTPException(status_code=400, detail=f"section must be one of {SECTIONS}")
    svc = get_supabase_service()
    photo = svc.get_profile_photo(photo_id)
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    svc.upsert_setting(f"{section}_avatar_url", photo["public_url"])
    return {"section": section, "url": photo["public_url"]}


# ── Unset a section (revert to default) ────────────────────────────────────────

@router.delete("/sections/{section}", dependencies=[Depends(require_admin)], status_code=204)
async def unset_section(section: str):
    if section not in SECTIONS:
        raise HTTPException(status_code=400, detail=f"section must be one of {SECTIONS}")
    svc = get_supabase_service()
    svc.delete_setting(f"{section}_avatar_url")


# ── Delete photo from storage + DB ─────────────────────────────────────────────

@router.delete("/photos/{photo_id}", dependencies=[Depends(require_admin)], status_code=204)
async def delete_photo(photo_id: str):
    svc = get_supabase_service()
    photo = svc.get_profile_photo(photo_id)
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")

    cfg = get_settings()
    storage_key = cfg.supabase_service_role_key or cfg.supabase_anon_key
    storage_client = create_client(cfg.supabase_url, storage_key)
    try:
        storage_client.storage.from_(BUCKET).remove([photo["storage_path"]])
    except Exception:
        pass

    # Clear any section references to this photo
    url = photo["public_url"]
    settings = svc.get_settings_dict()
    for section in SECTIONS:
        if settings.get(f"{section}_avatar_url") == url:
            svc.delete_setting(f"{section}_avatar_url")

    svc.delete_profile_photo(photo_id)
