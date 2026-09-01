from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session
from internal.database import get_db

app = FastAPI()


@app.get('/')
def sayHi() : 
    return "hi"

@app.get("/db-test")
def db_test(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1"))

    return {
        "database": result.scalar()
    }