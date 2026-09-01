import jwt
from fastapi.security import HTTPAuthorizationCredentials

from common.dependencies.auth import get_current_user
from internal.config import settings
from internal.jwt import create_access_token, decode_access_token


def test_get_current_user_uses_decoded_user_id(monkeypatch):
    monkeypatch.setattr("common.dependencies.auth.decode_access_token", lambda token: {"sub": 42})

    fake_user = object()
    monkeypatch.setattr(
        "common.dependencies.auth.user_service.get_user",
        lambda db, identifier: fake_user,
    )

    credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials="valid-token")

    assert get_current_user(credentials) is fake_user


def test_create_access_token_uses_string_subject():
    token = create_access_token(11)
    payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])

    assert payload["sub"] == "11"
    assert decode_access_token(token)["sub"] == 11
