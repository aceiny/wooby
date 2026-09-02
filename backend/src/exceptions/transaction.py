from fastapi import status

from exceptions.base import AppException


class TransactionNotFoundError(AppException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            code="TRANSACTION_NOT_FOUND",
            message="Transaction not found",
        )
