from fastapi import APIRouter, Depends
from app.services.supabase_service import get_supabase_service
from app.middleware.auth import require_admin

router = APIRouter()


@router.get("")
async def get_stats():
    svc = get_supabase_service()
    return svc.get_stats()


@router.get("/all", dependencies=[Depends(require_admin)])
async def get_all_stats():
    svc = get_supabase_service()
    return svc.get_all_stats()


@router.post("", dependencies=[Depends(require_admin)], status_code=201)
async def create_stat(body: dict):
    svc = get_supabase_service()
    return svc.create_stat(body)


@router.patch("/{stat_id}", dependencies=[Depends(require_admin)])
async def update_stat(stat_id: str, body: dict):
    svc = get_supabase_service()
    return svc.update_stat(stat_id, body)


@router.delete("/{stat_id}", dependencies=[Depends(require_admin)], status_code=204)
async def delete_stat(stat_id: str):
    svc = get_supabase_service()
    svc.delete_stat(stat_id)
