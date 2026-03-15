import pytest
from unittest.mock import patch, MagicMock
from app.services.auth_service import verify_supabase_token
from fastapi import HTTPException


def test_verify_token_invalid():
    with patch("app.services.auth_service.get_settings") as mock_settings:
        mock_settings.return_value = MagicMock(supabase_jwt_secret="test_secret")
        with pytest.raises(HTTPException) as exc_info:
            verify_supabase_token("invalid.token.here")
        assert exc_info.value.status_code == 401
