from fastapi import APIRouter, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.models.chatbot import ChatRequest, ChatResponse
from app.services.chatbot import get_chat_reply, make_message_item
from app.services.supabase_service import get_supabase_service
from app.config import get_settings

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
@limiter.limit(get_settings().rate_limit_chatbot)
async def chat(request: Request, body: ChatRequest):
    svc = get_supabase_service()

    # Load or initialise session
    session = svc.get_chat_session(body.session_id)
    messages: list = session["messages"] if session else []

    # Get AI reply
    reply = await get_chat_reply(messages, body.message)

    # Append user + assistant turns
    messages.append(make_message_item("user", body.message))
    messages.append(make_message_item("model", reply))

    # Persist session
    client_ip = request.client.host if request.client else None
    svc.upsert_chat_session(body.session_id, messages, ip=client_ip)

    return ChatResponse(
        session_id=body.session_id,
        reply=reply,
        messages=messages,
    )


@router.delete("/chat/{session_id}", status_code=204)
async def clear_chat(session_id: str):
    svc = get_supabase_service()
    svc.delete_chat_session(session_id)
