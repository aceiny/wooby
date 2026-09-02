from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from internal.database import BaseDatabaseModel
from models.institution import Institution
from models.user import User
from schemas.connection import ConnectionStatus

if TYPE_CHECKING:
    from models.account import Account


class BankConnection(BaseDatabaseModel):
    __tablename__ = "connections"

    status: Mapped[ConnectionStatus] = mapped_column(
        SQLEnum(ConnectionStatus),
        default=ConnectionStatus.SYNCING,
        nullable=False,
    )
    last_synced_at: Mapped[datetime | None] = mapped_column(nullable=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )
    user: Mapped[User] = relationship()

    institution_id: Mapped[int] = mapped_column(
        ForeignKey("institutions.id"),
        nullable=False,
    )
    institution: Mapped[Institution] = relationship()

    accounts: Mapped[list["Account"]] = relationship(
        "Account",
        back_populates="connection",
        cascade="all, delete-orphan",
    )
