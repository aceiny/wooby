from fastapi import FastAPI
from routers.accounts import router as account_router
from routers.auth import router as auth_router
from routers.connections import router as connection_router
from routers.institutions import router as institution_router
from routers.transactions import router as transaction_router
from routers.users import router as user_router


def register_app_routes(app: FastAPI) -> None:
    app.include_router(user_router)
    app.include_router(auth_router)
    app.include_router(institution_router)
    app.include_router(connection_router)
    app.include_router(account_router)
    app.include_router(transaction_router)