from decimal import Decimal
from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from internal.database import BaseDatabaseModel
from models.connection import BankConnection

if TYPE_CHECKING:
    from models.transaction import Transaction


class Account(BaseDatabaseModel):
    __tablename__ = "accounts"

    connection_id: Mapped[int] = mapped_column(
        ForeignKey("connections.id"),
        nullable=False,
    )
    external_id: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    currency: Mapped[str] = mapped_column(
        String(10),
        default="EUR",
        nullable=False,
    )
    balance: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        default=0.00,
        nullable=False,
    )

    connection: Mapped[BankConnection] = relationship(
        "BankConnection",
        back_populates="accounts",
    )

    transactions: Mapped[list["Transaction"]] = relationship(
        "Transaction",
        back_populates="account",
        cascade="all, delete-orphan",
    )
