from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from internal.database import BaseDatabaseModel
class User(BaseDatabaseModel) : 
    __tablename__ = "users"
    name: Mapped[str] = mapped_column(
        String(50),
    )
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
    )
    password: Mapped[str]= mapped_column(
        String(255),
    )