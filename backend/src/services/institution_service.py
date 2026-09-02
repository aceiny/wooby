import re
import unicodedata

from sqlalchemy.orm import Session

from exceptions.institution import InstitutionAlreadyExistsError, InstitutionNotFoundError
from models.institution import Institution
from repositories import institution_repository
from schemas.institution import InstitutionCreate


def build_slug(name: str) -> str:
    normalized = unicodedata.normalize("NFKD", name.lower())
    transliterated = "".join(
        ch for ch in normalized if not unicodedata.combining(ch)
    )
    slug = re.sub(r"[^a-z0-9\s-]", "", transliterated)
    slug = re.sub(r"[\s_]+", "-", slug.strip())
    slug = re.sub(r"-+", "-", slug)
    return slug.strip("-")


def create_institution(db: Session, data: InstitutionCreate) -> Institution:
    slug = build_slug(data.name)
    existing = institution_repository.get_institution_by_slug(db, slug)
    if existing is not None:
        raise InstitutionAlreadyExistsError()

    return institution_repository.create_institution(
        db,
        name=data.name.strip(),
        description=data.description.strip(),
        slug=slug,
    )


def get_institution(db: Session, institution_id: int) -> Institution:
    institution = institution_repository.get_institution_by_id(db, institution_id)
    if institution is None:
        raise InstitutionNotFoundError()
    return institution


def list_institutions(db: Session, skip: int = 0, limit: int = 100) -> list[Institution]:
    return institution_repository.list_institutions(db, skip=skip, limit=limit)
