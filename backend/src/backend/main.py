from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session
from exceptions.handlers import register_exception_handlers
from internal.database import get_db
import models
from routers.routes import register_app_routes

app = FastAPI()
register_exception_handlers(app)
register_app_routes(app)

@app.get('/')
def sayHi() : 
    return "hi"

@app.get("/db-test")
def db_test(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1"))

    return {
        "database": result.scalar()
    }
    
