export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public userMessage: string,
    public code?: string,
    public originalError?: unknown,
  ) {
    super(userMessage);
    this.name = 'ApiError';
  }
}

const ERROR_MESSAGES: Record<number, string> = {
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'This action conflicts with the current state.',
  422: 'Please check your input and try again.',
  500: 'Something went wrong on our end. Please try again later.',
};

export function getErrorMessage(status: number, fallback?: string): string {
  return ERROR_MESSAGES[status] || fallback || 'An unexpected error occurred. Please try again.';
}

export function createApiError(error: unknown): ApiError {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as {
      response?: {
        status: number;
        data?: {
          error?: { code?: string; message?: string };
          message?: string;
          detail?: string | Array<{ msg?: string }>;
        };
      };
    };
    const status = axiosError.response?.status || 500;
    const errObj = axiosError.response?.data?.error;
    const backendMessage =
      errObj?.message ||
      axiosError.response?.data?.message ||
      (typeof axiosError.response?.data?.detail === 'string'
        ? axiosError.response.data.detail
        : undefined);

    return new ApiError(
      status,
      backendMessage || getErrorMessage(status),
      errObj?.code,
      error,
    );
  }
  if (typeof error === 'string') {
    return new ApiError(500, error);
  }
  if (error instanceof Error) {
    return new ApiError(500, error.message, undefined, error);
  }
  return new ApiError(500, getErrorMessage(500), undefined, error);
}
