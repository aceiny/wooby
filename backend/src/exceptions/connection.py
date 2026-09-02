from http import HTTPStatus

from exceptions.base import AppException


class ConnectionNotFoundError(AppException):
    def __init__(self):
        super().__init__(
            message="Bank connection not found",
            code="CONNECTION_NOT_FOUND",
            status_code=HTTPStatus.NOT_FOUND,
        )


class InstitutionConnectionAlreadyExistsError(AppException):
    def __init__(self):
        super().__init__(
            message="This institution is already connected",
            code="CONNECTION_ALREADY_EXISTS",
            status_code=HTTPStatus.CONFLICT,
        )
