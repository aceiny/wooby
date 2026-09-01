
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from internal.database import BaseDatabaseModel


class Institution(BaseDatabaseModel):
    __tablename__="institutions"
    
    name : Mapped[str] = mapped_column(
        String(50)
    )
    slug : Mapped[str] = mapped_column(
        String(50)
    )
    description : Mapped[str] = mapped_column(
        String(200)
    )