import httpx
from typing import List, Dict
from app.config import get_settings


async def fetch_github_repos() -> List[Dict]:
    settings = get_settings()
    headers = {"Accept": "application/vnd.github+json"}
    if settings.github_token:
        headers["Authorization"] = f"Bearer {settings.github_token}"

    async with httpx.AsyncClient(timeout=10) as client:
        res = await client.get(
            f"https://api.github.com/users/{settings.github_username}/repos",
            headers=headers,
            params={"sort": "updated", "per_page": 30, "type": "public"},
        )
        res.raise_for_status()
        repos = res.json()

    return [
        {
            "name": r["name"],
            "description": r.get("description"),
            "html_url": r["html_url"],
            "homepage": r.get("homepage"),
            "topics": r.get("topics", []),
            "stargazers_count": r["stargazers_count"],
            "forks_count": r["forks_count"],
            "language": r.get("language"),
            "updated_at": r["updated_at"],
        }
        for r in repos
        if not r.get("fork")
    ]
