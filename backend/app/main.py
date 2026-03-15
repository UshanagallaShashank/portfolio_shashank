from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import get_settings
from app.routers import health, projects, skills, messages, resume, github, chatbot, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="Shashank Portfolio API",
        version="1.0.0",
        docs_url="/docs" if settings.app_env == "development" else None,
        redoc_url=None,
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_origin],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router)
    app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
    app.include_router(skills.router, prefix="/api/skills", tags=["skills"])
    app.include_router(messages.router, prefix="/api/messages", tags=["messages"])
    app.include_router(resume.router, prefix="/api/resume", tags=["resume"])
    app.include_router(github.router, prefix="/api/github", tags=["github"])
    app.include_router(chatbot.router, prefix="/api/chatbot", tags=["chatbot"])
    app.include_router(admin.router, prefix="/api/admin", tags=["admin"])

    return app


app = create_app()
