from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ChatRequest(BaseModel):
    session_id: str
    message: str


class ChatMessageItem(BaseModel):
    role: str
    content: str
    timestamp: datetime


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    messages: List[ChatMessageItem]


class ChatSession(BaseModel):
    session_id: str
    messages: List[ChatMessageItem]
    ip_address: Optional[str] = None
