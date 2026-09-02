from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from internal.database import get_db
from schemas.institution import InstitutionCreate, InstitutionResponse
from services.institution_service import create_institution, list_institutions

router = APIRouter(
    prefix="/institutions",
    tags=["institutions"],
)


@router.get("/", response_model=list[InstitutionResponse], status_code=status.HTTP_200_OK)
def get_institutions(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    return list_institutions(db, skip=skip, limit=limit)
