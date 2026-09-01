from fastapi import FastAPI
from routers.users import router as user_router
from routers.auth import router as auth_router


def register_app_routes(app : FastAPI) -> None : 
    app.include_router(user_router)
    app.include_router(auth_router)