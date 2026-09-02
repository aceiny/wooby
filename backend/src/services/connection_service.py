from decimal import Decimal
from sqlalchemy.orm import Session

from exceptions.connection import ConnectionNotFoundError, InstitutionConnectionAlreadyExistsError
from models.connection import BankConnection
from repositories import account_repository, connection_repository
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

    connection = connection_repository.create_connection(
        db, user_id, data.institution_id, data.status
    )

    # Seed default accounts for newly created connection
    slug = (institution.slug or "").lower()
    if "revolut" in slug:
        account_repository.create_account(
            db,
            connection_id=connection.id,
            external_id=f"ext-rev-{connection.id}-1",
            name="Personal Account",
            type_="checking",
            currency="EUR",
            balance=Decimal("2460.00"),
        )
        account_repository.create_account(
            db,
            connection_id=connection.id,
            external_id=f"ext-rev-{connection.id}-2",
            name="Savings Vault",
            type_="savings",
            currency="EUR",
            balance=Decimal("850.00"),
        )
    elif "bnp" in slug or "paribas" in slug:
        account_repository.create_account(
            db,
            connection_id=connection.id,
            external_id=f"ext-bnp-{connection.id}-1",
            name="Compte Courant",
            type_="checking",
            currency="EUR",
            balance=Decimal("1823.42"),
        )
        account_repository.create_account(
            db,
            connection_id=connection.id,
            external_id=f"ext-bnp-{connection.id}-2",
            name="Livret A",
            type_="savings",
            currency="EUR",
            balance=Decimal("5200.00"),
        )
    else:
        account_repository.create_account(
            db,
            connection_id=connection.id,
            external_id=f"ext-gen-{connection.id}-1",
            name="Main Account",
            type_="checking",
            currency="EUR",
            balance=Decimal("1500.00"),
        )

    return connection


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
