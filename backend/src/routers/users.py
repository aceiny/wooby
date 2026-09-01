from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from common.dependencies.auth import get_current_user
from internal.database import get_db
from models.user import User
from schemas.auth import JwtPayload
from schemas.user import UserIdentifier, UserResponse
from services.user_service import get_user

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/me" , response_model=UserResponse)
def getUser(current_user: JwtPayload = Depends(get_current_user) , db : Session = Depends(get_db)):
    return get_user(db , UserIdentifier(id=current_user.sub))
