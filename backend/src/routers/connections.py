from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from common.dependencies.auth import get_current_user
from internal.database import get_db
from schemas.auth import JwtPayload
from schemas.connection import BankConnectionResponse, ConnectionCreate
from services.connection_service import create_connection, delete_connection, get_connection, list_connections

router = APIRouter(
    prefix="/connections",
    tags=["connections"],
)


@router.get("/", response_model=list[BankConnectionResponse], status_code=status.HTTP_200_OK)
def get_connections(
    current_user: JwtPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    return list_connections(db, user_id=current_user.sub, skip=skip, limit=limit)


@router.get("/{connection_id}", response_model=BankConnectionResponse, status_code=status.HTTP_200_OK)
def get_connection_by_id(
    connection_id: int,
    current_user: JwtPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_connection(db, user_id=current_user.sub, connection_id=connection_id)


@router.post(
    "/",
    response_model=BankConnectionResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_connection(
    data: ConnectionCreate,
    current_user: JwtPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_connection(db, user_id=current_user.sub, data=data)


@router.delete("/{connection_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_connection(
    connection_id: int,
    current_user: JwtPayload = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    print("remove user")
    delete_connection(db, user_id=current_user.sub, connection_id=connection_id)
    return None
