from pydantic import BaseModel, UUID4
from typing import Optional, List
from datetime import datetime


class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    tech_stack: List[str] = []
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_featured: bool = False
    is_github_repo: bool = False
    github_repo_name: Optional[str] = None
    display_order: int = 0
    is_visible: bool = True


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None
    is_visible: Optional[bool] = None


class Project(ProjectBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
