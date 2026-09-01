

from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Enum as SQLEnum, ForeignKey
from internal.database import BaseDatabaseModel
from models.institution import Institution
from schemas.connection import ConnectionStatus


class BankConnection(BaseDatabaseModel) : 
    __tablename__ = "connections"
    status : Mapped[ConnectionStatus] = mapped_column(
        SQLEnum(ConnectionStatus),
        default=ConnectionStatus.SYNCING,
        nullable=False
    )
    last_synced_at : Mapped[datetime] = mapped_column(
        nullable=True
    )
    institution_id : Mapped[int] = mapped_column(
        ForeignKey('institutions.id'),
        nullable=False
    )
    institution : Mapped[Institution] = relationship()
    
