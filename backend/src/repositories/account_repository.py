from decimal import Decimal
from sqlalchemy import select
from sqlalchemy.orm import Session

from models.account import Account
from models.connection import BankConnection


def list_accounts_by_user_id(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 100,
) -> list[Account]:
    statement = (
        select(Account)
        .join(BankConnection, Account.connection_id == BankConnection.id)
        .where(BankConnection.user_id == user_id)
        .order_by(Account.id.asc())
        .offset(skip)
        .limit(limit)
    )
    return list(db.scalars(statement).all())


def get_account_by_id_and_user_id(
    db: Session,
    user_id: int,
    account_id: int,
) -> Account | None:
    statement = (
        select(Account)
        .join(BankConnection, Account.connection_id == BankConnection.id)
        .where(BankConnection.user_id == user_id, Account.id == account_id)
    )
    return db.scalar(statement)


def create_account(
    db: Session,
    connection_id: int,
    external_id: str,
    name: str,
    type_: str,
    currency: str = "EUR",
    balance: Decimal = Decimal("0.00"),
) -> Account:
    account = Account(
        connection_id=connection_id,
        external_id=external_id,
        name=name,
        type=type_,
        currency=currency,
        balance=balance,
    )
    db.add(account)
    db.commit()
    db.refresh(account)
    return account
