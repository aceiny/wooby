from sqlalchemy.orm import Session

from exceptions.transaction import TransactionNotFoundError
from models.transaction import Transaction
from repositories import transaction_repository


def list_transactions(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 100,
) -> list[Transaction]:
    return transaction_repository.list_transactions_by_user_id(
        db,
        user_id=user_id,
        skip=skip,
        limit=limit,
    )


def get_transaction(
    db: Session,
    user_id: int,
    transaction_id: int,
) -> Transaction:
    txn = transaction_repository.get_transaction_by_id_and_user_id(
        db,
        user_id=user_id,
        transaction_id=transaction_id,
    )
    if txn is None:
        raise TransactionNotFoundError()
    return txn
