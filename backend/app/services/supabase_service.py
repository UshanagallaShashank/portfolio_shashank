from supabase import Client
from typing import Any, Dict, List, Optional
from app.dependencies import get_supabase


class SupabaseService:
    def __init__(self, client: Client):
        self.db = client

    # Projects
    def get_projects(self) -> List[Dict]:
        res = self.db.table("projects").select("*").eq("is_visible", True).order("display_order").execute()
        return res.data or []

    def get_all_projects(self) -> List[Dict]:
        res = self.db.table("projects").select("*").order("display_order").execute()
        return res.data or []

    def get_featured_projects(self) -> List[Dict]:
        res = self.db.table("projects").select("*").eq("is_featured", True).eq("is_visible", True).order("display_order").execute()
        return res.data or []

    def get_project(self, project_id: str) -> Optional[Dict]:
        res = self.db.table("projects").select("*").eq("id", project_id).limit(1).execute()
        return res.data[0] if res.data else None

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
        res = self.db.table("skills").select("*").eq("is_visible", True).order("display_order").execute()
        return res.data or []

    def get_all_skills(self) -> List[Dict]:
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
        res = self.db.table("resume_versions").select("*").eq("is_active", True).limit(1).execute()
        return res.data[0] if res.data else None

    def create_resume_version(self, data: Dict) -> Dict:
        res = self.db.table("resume_versions").insert(data).execute()
        return res.data[0]

    def get_resume_version(self, resume_id: str) -> Optional[Dict]:
        res = self.db.table("resume_versions").select("*").eq("id", resume_id).limit(1).execute()
        return res.data[0] if res.data else None

    def delete_resume_version(self, resume_id: str) -> None:
        self.db.table("resume_versions").delete().eq("id", resume_id).execute()

    def activate_resume(self, resume_id: str) -> Dict:
        self.db.table("resume_versions").update({"is_active": False}).neq("id", resume_id).execute()
        res = self.db.table("resume_versions").update({"is_active": True}).eq("id", resume_id).execute()
        return res.data[0]

    # Stats (homepage highlights)
    def get_stats(self) -> List[Dict]:
        res = self.db.table("stats").select("*").eq("is_visible", True).order("display_order").execute()
        return res.data or []

    def get_all_stats(self) -> List[Dict]:
        res = self.db.table("stats").select("*").order("display_order").execute()
        return res.data or []

    def create_stat(self, data: Dict) -> Dict:
        res = self.db.table("stats").insert(data).execute()
        return res.data[0]

    def update_stat(self, stat_id: str, data: Dict) -> Dict:
        res = self.db.table("stats").update(data).eq("id", stat_id).execute()
        return res.data[0]

    def delete_stat(self, stat_id: str) -> None:
        self.db.table("stats").delete().eq("id", stat_id).execute()

    # Achievements
    def get_achievements(self) -> List[Dict]:
        res = self.db.table("achievements").select("*").eq("is_visible", True).order("display_order").execute()
        return res.data or []

    def get_all_achievements(self) -> List[Dict]:
        res = self.db.table("achievements").select("*").order("display_order").execute()
        return res.data or []

    def create_achievement(self, data: Dict) -> Dict:
        res = self.db.table("achievements").insert(data).execute()
        return res.data[0]

    def update_achievement(self, item_id: str, data: Dict) -> Dict:
        res = self.db.table("achievements").update(data).eq("id", item_id).execute()
        return res.data[0]

    def delete_achievement(self, item_id: str) -> None:
        self.db.table("achievements").delete().eq("id", item_id).execute()

    # Certifications
    def get_certifications(self) -> List[Dict]:
        res = self.db.table("certifications").select("*").eq("is_visible", True).order("display_order").execute()
        return res.data or []

    def get_all_certifications(self) -> List[Dict]:
        res = self.db.table("certifications").select("*").order("display_order").execute()
        return res.data or []

    def create_certification(self, data: Dict) -> Dict:
        res = self.db.table("certifications").insert(data).execute()
        return res.data[0]

    def update_certification(self, item_id: str, data: Dict) -> Dict:
        res = self.db.table("certifications").update(data).eq("id", item_id).execute()
        return res.data[0]

    def delete_certification(self, item_id: str) -> None:
        self.db.table("certifications").delete().eq("id", item_id).execute()

    # Chatbot sessions
    def get_chat_session(self, session_id: str) -> Optional[Dict]:
        res = self.db.table("chatbot_sessions").select("*").eq("session_id", session_id).limit(1).execute()
        return res.data[0] if res.data else None

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

    # Experience
    def get_experience(self) -> List[Dict]:
        res = self.db.table("experience").select("*").eq("is_visible", True).order("display_order").execute()
        return res.data or []

    def get_all_experience(self) -> List[Dict]:
        res = self.db.table("experience").select("*").order("display_order").execute()
        return res.data or []

    def create_experience(self, data: Dict) -> Dict:
        res = self.db.table("experience").insert(data).execute()
        return res.data[0]

    def update_experience(self, item_id: str, data: Dict) -> Dict:
        res = self.db.table("experience").update(data).eq("id", item_id).execute()
        return res.data[0]

    def delete_experience(self, item_id: str) -> None:
        self.db.table("experience").delete().eq("id", item_id).execute()

    # Collaborations
    def get_collaborations(self) -> List[Dict]:
        res = self.db.table("collaborations").select("*").eq("is_visible", True).order("display_order").execute()
        return res.data or []

    def get_all_collaborations(self) -> List[Dict]:
        res = self.db.table("collaborations").select("*").order("display_order").execute()
        return res.data or []

    def create_collaboration(self, data: Dict) -> Dict:
        res = self.db.table("collaborations").insert(data).execute()
        return res.data[0]

    def update_collaboration(self, item_id: str, data: Dict) -> Dict:
        res = self.db.table("collaborations").update(data).eq("id", item_id).execute()
        return res.data[0]

    def delete_collaboration(self, item_id: str) -> None:
        self.db.table("collaborations").delete().eq("id", item_id).execute()

    # Profile photos (versioned, one active)
    def get_profile_photos(self) -> List[Dict]:
        res = self.db.table("profile_photos").select("*").order("uploaded_at", desc=True).execute()
        return res.data or []

    def create_profile_photo(self, data: Dict) -> Dict:
        res = self.db.table("profile_photos").insert(data).execute()
        return res.data[0]

    def activate_profile_photo(self, photo_id: str) -> Dict:
        self.db.table("profile_photos").update({"is_active": False}).neq("id", photo_id).execute()
        res = self.db.table("profile_photos").update({"is_active": True}).eq("id", photo_id).execute()
        photo = res.data[0]
        self.upsert_setting("avatar_url", photo["public_url"])
        return photo

    def get_profile_photo(self, photo_id: str) -> Optional[Dict]:
        res = self.db.table("profile_photos").select("*").eq("id", photo_id).limit(1).execute()
        return res.data[0] if res.data else None

    def delete_profile_photo(self, photo_id: str) -> None:
        self.db.table("profile_photos").delete().eq("id", photo_id).execute()

    # Settings (key-value store)
    def get_settings_dict(self) -> Dict:
        res = self.db.table("settings").select("*").execute()
        return {row["key"]: row["value"] for row in (res.data or [])}

    def upsert_setting(self, key: str, value: str) -> None:
        self.db.table("settings").upsert({"key": key, "value": value}).execute()

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
