from http import HTTPStatus


class AppException(Exception):
    """Base class for all domain/business exceptions."""

    status_code: int = HTTPStatus.BAD_REQUEST

    def __init__(self, message: str, code: str, status_code: int | None = None):
        self.message = message
        self.code = code
        if status_code is not None:
            self.status_code = status_code
        super().__init__(message)