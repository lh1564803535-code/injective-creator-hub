/**
 * Error handling utilities
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NetworkError extends AppError {
  constructor(message: string = "Network error occurred") {
    super(message, "NETWORK_ERROR", 503);
    this.name = "NetworkError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string>) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, "UNKNOWN_ERROR");
  }

  return new AppError("An unexpected error occurred", "UNKNOWN_ERROR");
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof NetworkError;
}

export function getErrorMessage(error: unknown): string {
  const appError = handleError(error);
  return appError.message;
}
