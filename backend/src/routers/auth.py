


from fastapi import APIRouter, Depends,status
from sqlalchemy.orm import Session

from internal.database import get_db
from schemas.auth import LoginRequest, TokenResponse
from schemas.user import UserCreate
from services.auth_service import login_user, register_user

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED
    )
def add_user(
    data : UserCreate,
    db : Session = Depends(get_db)
) : 
    return register_user(db , data)

@router.post(
    "/login",
    response_model=TokenResponse,
    )
def signin_user(
    data : LoginRequest,
    db : Session = Depends(get_db)
) : 
    return login_user(db , data)
