from fastapi import APIRouter, Depends
from app.services.supabase_service import get_supabase_service
from app.middleware.auth import require_admin

router = APIRouter()


@router.get("")
async def get_experience():
    svc = get_supabase_service()
    return svc.get_experience()


@router.get("/all", dependencies=[Depends(require_admin)])
async def get_all_experience():
    svc = get_supabase_service()
    return svc.get_all_experience()


@router.post("", dependencies=[Depends(require_admin)], status_code=201)
async def create_experience(body: dict):
    svc = get_supabase_service()
    return svc.create_experience(body)


@router.patch("/{item_id}", dependencies=[Depends(require_admin)])
async def update_experience(item_id: str, body: dict):
    svc = get_supabase_service()
    return svc.update_experience(item_id, body)


@router.delete("/{item_id}", dependencies=[Depends(require_admin)], status_code=204)
async def delete_experience(item_id: str):
    svc = get_supabase_service()
    svc.delete_experience(item_id)
