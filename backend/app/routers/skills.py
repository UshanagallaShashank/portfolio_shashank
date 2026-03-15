from fastapi import APIRouter, Depends
from app.models.skill import SkillCreate, SkillUpdate
from app.services.supabase_service import get_supabase_service
from app.middleware.auth import require_admin

router = APIRouter()


@router.get("")
async def get_skills():
    svc = get_supabase_service()
    return svc.get_skills()


@router.get("/all", dependencies=[Depends(require_admin)])
async def get_all_skills():
    svc = get_supabase_service()
    return svc.get_all_skills()


@router.post("", dependencies=[Depends(require_admin)], status_code=201)
async def create_skill(body: SkillCreate):
    svc = get_supabase_service()
    return svc.create_skill(body.model_dump())


@router.patch("/{skill_id}", dependencies=[Depends(require_admin)])
async def update_skill(skill_id: str, body: SkillUpdate):
    svc = get_supabase_service()
    return svc.update_skill(skill_id, body.model_dump(exclude_none=True))


@router.delete("/{skill_id}", dependencies=[Depends(require_admin)], status_code=204)
async def delete_skill(skill_id: str):
    svc = get_supabase_service()
    svc.delete_skill(skill_id)
