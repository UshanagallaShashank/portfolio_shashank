from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.project import ProjectCreate, ProjectUpdate
from app.services.supabase_service import get_supabase_service
from app.middleware.auth import require_admin

router = APIRouter()


@router.get("")
async def get_projects():
    svc = get_supabase_service()
    return svc.get_projects()


@router.get("/all", dependencies=[Depends(require_admin)])
async def get_all_projects():
    svc = get_supabase_service()
    return svc.get_all_projects()


@router.get("/featured")
async def get_featured_projects():
    svc = get_supabase_service()
    return svc.get_featured_projects()


@router.get("/{project_id}")
async def get_project(project_id: str):
    svc = get_supabase_service()
    project = svc.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("", dependencies=[Depends(require_admin)], status_code=201)
async def create_project(body: ProjectCreate):
    svc = get_supabase_service()
    return svc.create_project(body.model_dump())


@router.patch("/{project_id}", dependencies=[Depends(require_admin)])
async def update_project(project_id: str, body: ProjectUpdate):
    svc = get_supabase_service()
    return svc.update_project(project_id, body.model_dump(exclude_none=True))


@router.delete("/{project_id}", dependencies=[Depends(require_admin)], status_code=204)
async def delete_project(project_id: str):
    svc = get_supabase_service()
    svc.delete_project(project_id)
