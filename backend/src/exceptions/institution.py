from http import HTTPStatus

from exceptions.base import AppException


class InstitutionNotFoundError(AppException):
    def __init__(self):
        super().__init__(
            message="Institution not found",
            code="INSTITUTION_NOT_FOUND",
            status_code=HTTPStatus.NOT_FOUND,
        )


class InstitutionAlreadyExistsError(AppException):
    def __init__(self):
        super().__init__(
            message="Institution already exists",
            code="INSTITUTION_ALREADY_EXISTS",
            status_code=HTTPStatus.CONFLICT,
        )
