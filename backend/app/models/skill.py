from pydantic import BaseModel, UUID4
from typing import Optional


class SkillBase(BaseModel):
    name: str
    category: Optional[str] = None
    icon_url: Optional[str] = None
    proficiency: int = 80
    display_order: int = 0
    is_visible: bool = True


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    proficiency: Optional[int] = None
    display_order: Optional[int] = None
    is_visible: Optional[bool] = None


class Skill(SkillBase):
    id: UUID4

    class Config:
        from_attributes = True
