from http import HTTPStatus
from exceptions.base import AppException


class EmailAlreadyExistsError(AppException):
    def __init__(self):
        super().__init__(
            message="Email already used",
            code="EMAIL_ALREADY_EXISTS",
            status_code=HTTPStatus.CONFLICT,  #409
        )


class UserNotFoundError(AppException):
    def __init__(self):
        super().__init__(
            message="User not found",
            code="USER_NOT_FOUND",
            status_code=HTTPStatus.NOT_FOUND,
        )
        