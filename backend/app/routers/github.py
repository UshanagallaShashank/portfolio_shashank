from fastapi import APIRouter, HTTPException
from app.services.github import fetch_github_repos

router = APIRouter()


@router.get("/repos")
async def get_repos():
    try:
        return await fetch_github_repos()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"GitHub API error: {str(e)}")
