
from sqlalchemy.orm import Session

from common.utils.hash_utils import verify_password
from exceptions.auth import AuthenticationError, InvalidCredentialsError
from internal.jwt import create_access_token
from models.user import User
from schemas.auth import LoginRequest, TokenResponse
from schemas.user import UserCreate, UserIdentifier
from services import user_service
from services.user_service import create_user

def validate_user(user : User , data : LoginRequest) -> bool :
    if not data or not user or not user.password : 
        raise AuthenticationError()
    
    if not verify_password(user.password , data.password) : 
        raise InvalidCredentialsError()
    return True
    
def register_user(db : Session , data : UserCreate) -> TokenResponse : 
    user = create_user(db , data)
    accessToken = create_access_token(user.id)
    return TokenResponse(access_token=accessToken)

def login_user(db : Session , data : LoginRequest) -> TokenResponse : 
    user = user_service.get_user(db , identifier=UserIdentifier(email=data.email))
    validate_user(user, data)
    accessToken = create_access_token(user.id)
    return TokenResponse(access_token=accessToken)
