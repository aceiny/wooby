from fastapi import status

from exceptions.base import AppException


class AccountNotFoundError(AppException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            code="ACCOUNT_NOT_FOUND",
            message="Account not found",
        )
