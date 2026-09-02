from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from models.connection import BankConnection
from schemas.connection import ConnectionStatus


def get_connection_by_id(db: Session, user_id: int, connection_id: int) -> BankConnection | None:
    statement = (
        select(BankConnection)
        .options(selectinload(BankConnection.institution))
        .where(BankConnection.id == connection_id, BankConnection.user_id == user_id)
    )
    return db.scalar(statement)


def list_connections(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> list[BankConnection]:
    statement = (
        select(BankConnection)
        .options(selectinload(BankConnection.institution))
        .where(BankConnection.user_id == user_id)
        .order_by(BankConnection.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return db.scalars(statement).all()


def create_connection(db: Session, user_id: int, institution_id: int, status: ConnectionStatus) -> BankConnection:
    connection = BankConnection(user_id=user_id, institution_id=institution_id, status=status)
    db.add(connection)
    db.commit()
    db.refresh(connection)
    return connection


def delete_connection(db: Session, connection: BankConnection) -> None:
    db.delete(connection)
    db.commit()
