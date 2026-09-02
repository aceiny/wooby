from sqlalchemy.orm import Session

from exceptions.connection import ConnectionNotFoundError, InstitutionConnectionAlreadyExistsError
from models.connection import BankConnection
from repositories import connection_repository
from repositories.institution_repository import get_institution_by_id
from schemas.connection import ConnectionCreate


def create_connection(db: Session, user_id: int, data: ConnectionCreate) -> BankConnection:
    institution = get_institution_by_id(db, data.institution_id)
    if institution is None:
        raise ValueError("Institution not found")

    existing = (
        db.query(BankConnection)
        .filter_by(user_id=user_id, institution_id=data.institution_id)
        .first()
    )
    if existing is not None:
        raise InstitutionConnectionAlreadyExistsError()

    return connection_repository.create_connection(db, user_id, data.institution_id, data.status)


def list_connections(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> list[BankConnection]:
    return connection_repository.list_connections(db, user_id=user_id, skip=skip, limit=limit)


def get_connection(db: Session, user_id: int, connection_id: int) -> BankConnection:
    connection = connection_repository.get_connection_by_id(db, user_id=user_id, connection_id=connection_id)
    if connection is None:
        raise ConnectionNotFoundError()
    return connection


def delete_connection(db: Session, user_id: int, connection_id: int) -> None:
    connection = connection_repository.get_connection_by_id(db, user_id=user_id, connection_id=connection_id)
    if connection is None:
        raise ConnectionNotFoundError()
    connection_repository.delete_connection(db, connection)
