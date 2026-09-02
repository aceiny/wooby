from sqlalchemy.orm import Session

from exceptions.account import AccountNotFoundError
from models.account import Account
from repositories import account_repository


def list_accounts(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 100,
) -> list[Account]:
    return account_repository.list_accounts_by_user_id(
        db,
        user_id=user_id,
        skip=skip,
        limit=limit,
    )


def get_account(
    db: Session,
    user_id: int,
    account_id: int,
) -> Account:
    account = account_repository.get_account_by_id_and_user_id(
        db,
        user_id=user_id,
        account_id=account_id,
    )
    if account is None:
        raise AccountNotFoundError()
    return account
