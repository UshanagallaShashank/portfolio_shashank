from pydantic import BaseModel, EmailStr, UUID4
from typing import Optional
from datetime import datetime


class MessageCreate(BaseModel):
    sender_name: str
    sender_email: EmailStr
    subject: Optional[str] = None
    body: str
    allow_email: bool = False


class Message(BaseModel):
    id: UUID4
    sender_name: str
    sender_email: str
    subject: Optional[str] = None
    body: str
    allow_email: bool
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
