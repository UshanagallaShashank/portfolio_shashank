from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.config import get_settings
from app.routers import health, projects, skills, messages, resume, github, chatbot, admin, stats, achievements, experience, collaborations, profile


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

    @app.exception_handler(Exception)
    async def _unhandled(_req: Request, exc: Exception):
        return JSONResponse(
            status_code=500,
            content={"detail": str(exc)},
            headers={"Access-Control-Allow-Origin": "*"},
        )

    origins = [o.strip() for o in settings.frontend_origin.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=False,
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
    app.include_router(achievements.router, prefix="/api/achievements", tags=["achievements"])
    app.include_router(experience.router, prefix="/api/experience", tags=["experience"])
    app.include_router(collaborations.router, prefix="/api/collaborations", tags=["collaborations"])
    app.include_router(profile.router, prefix="/api/profile", tags=["profile"])

    return app


app = create_app()
