from dataclasses import dataclass

from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

@dataclass
class JwtPayload :
    sub: int
    exp: int