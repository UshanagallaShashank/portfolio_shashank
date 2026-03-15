import httpx
from app.config import get_settings


async def notify_via_n8n(message_data: dict) -> None:
    settings = get_settings()
    if not settings.n8n_contact_webhook_url:
        return
    async with httpx.AsyncClient(timeout=5) as client:
        try:
            await client.post(settings.n8n_contact_webhook_url, json=message_data)
        except Exception:
            pass  # Non-blocking — don't fail the request if n8n is down
