from pydantic import EmailStr
from sqlalchemy import select
from sqlalchemy.orm import Session

from models.user import User

def get_user_by_id(db : Session , user_id : int) -> User | None :
    statement = select(User).where(User.id == user_id)
    print(statement)
    return db.scalar(statement)

def get_user_by_email(db : Session , email : EmailStr) :
    statement = select(User).where(User.email == email)
    return db.scalar(statement)
    
def create_user(
    db : Session , 
    name: str,
    email: str,
    password_hash: str
    ) -> User :
    user = User(
        name = name,
        email = email,
        password = password_hash
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    print("user in create user" , user)
    return user
    
def delete_user(db : Session , user : User) -> None :
    db.delete(user)
    db.commit()
    