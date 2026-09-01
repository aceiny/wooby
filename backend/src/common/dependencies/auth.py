from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from internal.database import get_db
from internal.jwt import decode_access_token
from schemas.auth import JwtPayload
from services import user_service
from schemas.user import UserIdentifier
from exceptions.auth import InvalidTokenError

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> JwtPayload :
    token = (credentials.credentials or "").strip()
    print("token repr:", repr(token))

    if not token:
        raise InvalidTokenError()

    payload = decode_access_token(token)
    user_id = payload.get("sub")

    if user_id is None:
        raise InvalidTokenError()
    
    
    return JwtPayload(
        sub=user_id,
        exp=payload.get("exp")
    )