from fastapi import APIRouter, Depends, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.models.message import MessageCreate
from app.services.supabase_service import get_supabase_service
from app.services.messages import notify_via_n8n
from app.middleware.auth import require_admin
from app.config import get_settings

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()


@router.post("", status_code=201)
@limiter.limit(get_settings().rate_limit_contact)
async def submit_message(request: Request, body: MessageCreate):
    svc = get_supabase_service()
    data = body.model_dump()
    saved = svc.create_message(data)
    await notify_via_n8n(data)
    return saved


@router.get("", dependencies=[Depends(require_admin)])
async def get_messages():
    svc = get_supabase_service()
    return svc.get_messages()


@router.patch("/{message_id}/read", dependencies=[Depends(require_admin)])
async def mark_read(message_id: str):
    svc = get_supabase_service()
    return svc.mark_message_read(message_id)


@router.delete("/{message_id}", dependencies=[Depends(require_admin)], status_code=204)
async def delete_message(message_id: str):
    svc = get_supabase_service()
    svc.delete_message(message_id)
