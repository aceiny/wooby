from datetime import date
from decimal import Decimal
from sqlalchemy import select
from sqlalchemy.orm import Session

from models.account import Account
from models.connection import BankConnection
from models.transaction import Transaction


def list_transactions_by_user_id(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 100,
) -> list[Transaction]:
    statement = (
        select(Transaction)
        .join(Account, Transaction.account_id == Account.id)
        .join(BankConnection, Account.connection_id == BankConnection.id)
        .where(BankConnection.user_id == user_id)
        .order_by(Transaction.date.desc(), Transaction.id.desc())
        .offset(skip)
        .limit(limit)
    )
    return list(db.scalars(statement).all())


def get_transaction_by_id_and_user_id(
    db: Session,
    user_id: int,
    transaction_id: int,
) -> Transaction | None:
    statement = (
        select(Transaction)
        .join(Account, Transaction.account_id == Account.id)
        .join(BankConnection, Account.connection_id == BankConnection.id)
        .where(BankConnection.user_id == user_id, Transaction.id == transaction_id)
    )
    return db.scalar(statement)


def create_transaction(
    db: Session,
    account_id: int,
    external_id: str,
    amount: Decimal,
    label: str,
    date_: date,
    currency: str = "EUR",
    category: str | None = None,
) -> Transaction:
    txn = Transaction(
        account_id=account_id,
        external_id=external_id,
        amount=amount,
        label=label,
        date=date_,
        currency=currency,
        category=category,
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return txn
