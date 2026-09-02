from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from common.dependencies.auth import get_current_user
from internal.database import get_db
from schemas.auth import JwtPayload
from schemas.transaction import TransactionResponse
from services.transaction_service import get_transaction, list_transactions

router = APIRouter(
    prefix="/transactions",
    tags=["transactions"],
)


@router.get(
    "/",
    response_model=list[TransactionResponse],
    status_code=status.HTTP_200_OK,
)
def get_transactions(
    current_user: JwtPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    return list_transactions(db, user_id=current_user.sub, skip=skip, limit=limit)


@router.get(
    "/{transaction_id}",
    response_model=TransactionResponse,
    status_code=status.HTTP_200_OK,
)
def get_transaction_by_id(
    transaction_id: int,
    current_user: JwtPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_transaction(db, user_id=current_user.sub, transaction_id=transaction_id)
