from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.config import get_settings
from app.routers import health, projects, skills, messages, resume, github, chatbot, admin, stats


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    limiter = Limiter(key_func=get_remote_address)

    app = FastAPI(
        title="Shashank Portfolio API",
        version="1.0.0",
        docs_url="/docs" if settings.app_env == "development" else None,
        redoc_url=None,
        lifespan=lifespan,
    )

    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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
    app.include_router(stats.router, prefix="/api/stats", tags=["stats"])

    return app


app = create_app()
