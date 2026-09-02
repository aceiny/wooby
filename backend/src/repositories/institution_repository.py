from sqlalchemy import select
from sqlalchemy.orm import Session

from models.institution import Institution


def get_institution_by_id(db: Session, institution_id: int) -> Institution | None:
    statement = select(Institution).where(Institution.id == institution_id)
    return db.scalar(statement)


def get_institution_by_slug(db: Session, slug: str) -> Institution | None:
    statement = select(Institution).where(Institution.slug == slug)
    return db.scalar(statement)


def list_institutions(db: Session, skip: int = 0, limit: int = 100) -> list[Institution]:
    statement = select(Institution).order_by(Institution.name.asc()).offset(skip).limit(limit)
    return db.scalars(statement).all()


def create_institution(db: Session, name: str, description: str, slug: str) -> Institution:
    institution = Institution(name=name, description=description, slug=slug)
    db.add(institution)
    db.commit()
    db.refresh(institution)
    return institution
