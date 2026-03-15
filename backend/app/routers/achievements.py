from fastapi import APIRouter, Depends
from app.services.supabase_service import get_supabase_service
from app.middleware.auth import require_admin

router = APIRouter()


@router.get("")
async def get_achievements():
    svc = get_supabase_service()
    return svc.get_achievements()


@router.get("/all", dependencies=[Depends(require_admin)])
async def get_all_achievements():
    svc = get_supabase_service()
    return svc.get_all_achievements()


@router.post("", dependencies=[Depends(require_admin)], status_code=201)
async def create_achievement(body: dict):
    svc = get_supabase_service()
    return svc.create_achievement(body)


@router.patch("/{item_id}", dependencies=[Depends(require_admin)])
async def update_achievement(item_id: str, body: dict):
    svc = get_supabase_service()
    return svc.update_achievement(item_id, body)


@router.delete("/{item_id}", dependencies=[Depends(require_admin)], status_code=204)
async def delete_achievement(item_id: str):
    svc = get_supabase_service()
    svc.delete_achievement(item_id)


# Certifications sub-routes (same file for simplicity)
@router.get("/certifications")
async def get_certifications():
    svc = get_supabase_service()
    return svc.get_certifications()


@router.get("/certifications/all", dependencies=[Depends(require_admin)])
async def get_all_certifications():
    svc = get_supabase_service()
    return svc.get_all_certifications()


@router.post("/certifications", dependencies=[Depends(require_admin)], status_code=201)
async def create_certification(body: dict):
    svc = get_supabase_service()
    return svc.create_certification(body)


@router.patch("/certifications/{item_id}", dependencies=[Depends(require_admin)])
async def update_certification(item_id: str, body: dict):
    svc = get_supabase_service()
    return svc.update_certification(item_id, body)


@router.delete("/certifications/{item_id}", dependencies=[Depends(require_admin)], status_code=204)
async def delete_certification(item_id: str):
    svc = get_supabase_service()
    svc.delete_certification(item_id)
