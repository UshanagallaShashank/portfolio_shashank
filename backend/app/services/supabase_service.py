from supabase import Client
from typing import Any, Dict, List, Optional
from app.dependencies import get_supabase


class SupabaseService:
    def __init__(self, client: Client):
        self.db = client

    # Projects
    def get_projects(self) -> List[Dict]:
        res = self.db.table("projects").select("*").order("display_order").execute()
        return res.data or []

    def get_featured_projects(self) -> List[Dict]:
        res = self.db.table("projects").select("*").eq("is_featured", True).order("display_order").execute()
        return res.data or []

    def get_project(self, project_id: str) -> Optional[Dict]:
        res = self.db.table("projects").select("*").eq("id", project_id).maybe_single().execute()
        return res.data

    def create_project(self, data: Dict) -> Dict:
        res = self.db.table("projects").insert(data).execute()
        return res.data[0]

    def update_project(self, project_id: str, data: Dict) -> Dict:
        res = self.db.table("projects").update(data).eq("id", project_id).execute()
        return res.data[0]

    def delete_project(self, project_id: str) -> None:
        self.db.table("projects").delete().eq("id", project_id).execute()

    # Skills
    def get_skills(self) -> List[Dict]:
        res = self.db.table("skills").select("*").order("display_order").execute()
        return res.data or []

    def create_skill(self, data: Dict) -> Dict:
        res = self.db.table("skills").insert(data).execute()
        return res.data[0]

    def update_skill(self, skill_id: str, data: Dict) -> Dict:
        res = self.db.table("skills").update(data).eq("id", skill_id).execute()
        return res.data[0]

    def delete_skill(self, skill_id: str) -> None:
        self.db.table("skills").delete().eq("id", skill_id).execute()

    # Messages
    def create_message(self, data: Dict) -> Dict:
        res = self.db.table("messages").insert(data).execute()
        return res.data[0]

    def get_messages(self) -> List[Dict]:
        res = self.db.table("messages").select("*").order("created_at", desc=True).execute()
        return res.data or []

    def mark_message_read(self, message_id: str) -> Dict:
        res = self.db.table("messages").update({"is_read": True}).eq("id", message_id).execute()
        return res.data[0]

    def delete_message(self, message_id: str) -> None:
        self.db.table("messages").delete().eq("id", message_id).execute()

    # Resume versions
    def get_resume_versions(self) -> List[Dict]:
        res = self.db.table("resume_versions").select("*").order("uploaded_at", desc=True).execute()
        return res.data or []

    def get_active_resume(self) -> Optional[Dict]:
        res = self.db.table("resume_versions").select("*").eq("is_active", True).maybe_single().execute()
        return res.data

    def create_resume_version(self, data: Dict) -> Dict:
        res = self.db.table("resume_versions").insert(data).execute()
        return res.data[0]

    def activate_resume(self, resume_id: str) -> Dict:
        self.db.table("resume_versions").update({"is_active": False}).neq("id", resume_id).execute()
        res = self.db.table("resume_versions").update({"is_active": True}).eq("id", resume_id).execute()
        return res.data[0]

    # Chatbot sessions
    def get_chat_session(self, session_id: str) -> Optional[Dict]:
        res = self.db.table("chatbot_sessions").select("*").eq("session_id", session_id).maybe_single().execute()
        return res.data

    def upsert_chat_session(self, session_id: str, messages: List[Dict], ip: Optional[str] = None) -> Dict:
        res = self.db.table("chatbot_sessions").upsert({
            "session_id": session_id,
            "messages": messages,
            "ip_address": ip,
            "updated_at": "now()",
        }, on_conflict="session_id").execute()
        return res.data[0]

    def delete_chat_session(self, session_id: str) -> None:
        self.db.table("chatbot_sessions").delete().eq("session_id", session_id).execute()

    # Dashboard stats
    def get_dashboard_stats(self) -> Dict:
        msg_res = self.db.table("messages").select("id, is_read", count="exact").execute()
        proj_res = self.db.table("projects").select("id", count="exact").execute()
        active_resume = self.get_active_resume()
        unread = sum(1 for m in (msg_res.data or []) if not m.get("is_read"))
        return {
            "total_messages": msg_res.count or 0,
            "unread_messages": unread,
            "total_projects": proj_res.count or 0,
            "active_resume": active_resume.get("file_name") if active_resume else None,
        }


def get_supabase_service() -> SupabaseService:
    return SupabaseService(get_supabase())
