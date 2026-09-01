import email

from sqlalchemy.orm import Session

from common.utils.hash_utils import hash_password, hash_string
from exceptions.user import EmailAlreadyExistsError, UserNotFoundError
from models.user import User
from repositories import user_repository
from schemas.user import UserCreate, UserIdentifier

def check_existing_user(db : Session , data : UserCreate) : 
    existing_user = user_repository.get_user_by_email(db , str(data.email))
    if existing_user : 
        raise EmailAlreadyExistsError()
    
def create_user(db : Session , data : UserCreate) -> User :
    check_existing_user(db , data) #this will raise error if found 
    password_hash = hash_password(data.password)
    return user_repository.create_user(
        db , 
        name=data.name,
        email=data.email,
        password_hash=password_hash
        )

def get_user(db: Session, identifier: UserIdentifier) -> User:
    if identifier.id is not None:
        user = user_repository.get_user_by_id(db, identifier.id)

    elif identifier.email is not None:
        user = user_repository.get_user_by_email(db, identifier.email)

    else:
        raise ValueError("Either id or email must be provided")

    if user is None:
        raise UserNotFoundError()

    return user