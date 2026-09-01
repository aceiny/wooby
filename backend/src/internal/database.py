from datetime import datetime
from sqlalchemy import DateTime, create_engine, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker
from internal.config import settings

engine = create_engine(
    settings.database_url,
    echo=True,
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)


class BaseDatabaseModel(DeclarativeBase):
    id : Mapped[int] = mapped_column(primary_key=True)
    created_at : Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    updated_at : Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        
    )

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()