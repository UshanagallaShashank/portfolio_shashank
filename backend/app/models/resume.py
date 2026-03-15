from pydantic import BaseModel, UUID4
from typing import Optional
from datetime import datetime


class ResumeVersion(BaseModel):
    id: UUID4
    file_name: str
    storage_path: str
    public_url: str
    is_active: bool
    uploaded_at: datetime

    class Config:
        from_attributes = True
