from http import HTTPStatus

from exceptions.base import AppException

class AuthenticationError(AppException):
    def __init__(self):
        super().__init__(
            message="Invalid email or password",
            code="INVALID_CREDENTIALS",
            status_code=HTTPStatus.UNAUTHORIZED,
        )
        
class InvalidCredentialsError(AppException):
    def __init__(self):
        super().__init__(
            message="Invalid email or password",
            code="INVALID_CREDENTIALS",
            status_code=HTTPStatus.UNAUTHORIZED,
        )

class UserNotFoundError(AppException):
    def __init__(self):
        super().__init__(
            message="User not found",
            code="USER_NOT_FOUND",
            status_code=HTTPStatus.NOT_FOUND,
        )


class InvalidTokenError(AppException):
    def __init__(self):
        super().__init__(
            message="Invalid or expired token",
            code="INVALID_TOKEN",
            status_code=HTTPStatus.UNAUTHORIZED,
        )


class AuthenticationRequiredError(AppException):
    def __init__(self):
        super().__init__(
            message="Authentication required",
            code="AUTHENTICATION_REQUIRED",
            status_code=HTTPStatus.UNAUTHORIZED,
        )


class TokenExpiredError(AppException):
    def __init__(self):
        super().__init__(
            message="Token has expired",
            code="TOKEN_EXPIRED",
            status_code=HTTPStatus.UNAUTHORIZED,
        )