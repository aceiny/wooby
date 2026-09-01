from argon2 import PasswordHasher
import hashlib

_password_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    return _password_hasher.hash(password)


def verify_password(hashed_password: str, password: str) -> bool:
    try:
        return _password_hasher.verify(hashed_password, password)
    except Exception:
        return False

def hash_string(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()

def verify_string(value: str, hashed_value: str) -> bool:
    return hash_string(value) == hashed_value