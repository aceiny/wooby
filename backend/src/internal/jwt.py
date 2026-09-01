from datetime import datetime, timedelta, timezone
import jwt
from jwt.exceptions import InvalidTokenError as JWTError
from exceptions.auth import InvalidTokenError
from internal.config import settings


def create_access_token(subject: str | int) -> str:
    subject_str = str(subject)
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.jwt_access_token_expire_minutes
    )

    payload = {
        "sub": subject_str,
        "exp": expires_at,
    }

    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )


def decode_access_token(token: str) -> dict:
    token = str(token or "").strip()

    if not token:
        raise InvalidTokenError()

    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
        )
        print("payload in decode_access_token", payload)

        user_id = payload.get("sub")

        if user_id is None:
            raise InvalidTokenError()

        return {"sub": int(user_id), "exp": payload.get("exp")}

    except (JWTError, ValueError, TypeError):
        raise InvalidTokenError()