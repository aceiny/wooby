from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from common.dependencies.auth import get_current_user
from internal.database import get_db
from schemas.account import AccountResponse
from schemas.auth import JwtPayload
from services.account_service import get_account, list_accounts

router = APIRouter(
    prefix="/accounts",
    tags=["accounts"],
)


@router.get(
    "/",
    response_model=list[AccountResponse],
    status_code=status.HTTP_200_OK,
)
def get_accounts(
    current_user: JwtPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    return list_accounts(db, user_id=current_user.sub, skip=skip, limit=limit)


@router.get(
    "/{account_id}",
    response_model=AccountResponse,
    status_code=status.HTTP_200_OK,
)
def get_account_by_id(
    account_id: int,
    current_user: JwtPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_account(db, user_id=current_user.sub, account_id=account_id)
