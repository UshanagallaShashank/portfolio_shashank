from google import genai
from google.genai import types
from datetime import datetime, timezone
from typing import List, Dict
from app.config import get_settings

SYSTEM_PROMPT = """You are an AI assistant on Shashank Ushanagalla's personal portfolio website.
You help visitors learn about Shashank's skills, projects, work experience, and how to get in touch.
Be concise, friendly, and professional. If asked something unrelated to Shashank or the portfolio,
politely redirect the conversation back to relevant topics."""


def _get_client():
    settings = get_settings()
    return genai.Client(api_key=settings.google_api_key)


async def get_chat_reply(session_messages: List[Dict], user_message: str) -> str:
    settings = get_settings()
    client = _get_client()

    # Convert stored messages to Gemini Content format
    history = [
        types.Content(role=m["role"], parts=[types.Part(text=m["content"])])
        for m in session_messages
    ]

    config = types.GenerateContentConfig(system_instruction=SYSTEM_PROMPT)

    # Append the new user message
    contents = history + [types.Content(role="user", parts=[types.Part(text=user_message)])]

    response = await client.aio.models.generate_content(
        model=settings.google_adk_model,
        contents=contents,
        config=config,
    )
    return response.text


def make_message_item(role: str, content: str) -> Dict:
    return {
        "role": role,
        "content": content,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
