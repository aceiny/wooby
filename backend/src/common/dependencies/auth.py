from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from exceptions.auth import InvalidTokenError
from internal.jwt import decode_access_token
from schemas.auth import JwtPayload

# auto_error=False allows falling back to Cookie authentication if Authorization header is absent
security = HTTPBearer(auto_error=False)


def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> JwtPayload:
    token: str | None = None

    if credentials and credentials.credentials:
        token = credentials.credentials.strip()
    else:
        cookie_token = request.cookies.get("token")
        if cookie_token:
            token = cookie_token.strip()

    if not token:
        raise InvalidTokenError()

    payload = decode_access_token(token)
    user_id = payload.get("sub")

    if user_id is None:
        raise InvalidTokenError()

    return JwtPayload(
        sub=user_id,
        exp=payload.get("exp"),
    )