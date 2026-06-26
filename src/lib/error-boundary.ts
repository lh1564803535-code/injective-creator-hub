/**
 * Error Boundary utilities
 */

interface ErrorInfo {
  componentStack: string;
  digest?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundaryManager {
  private errors: Array<{ error: Error; errorInfo: ErrorInfo; timestamp: number }> = [];
  private listeners: Set<(errors: Array<{ error: Error; errorInfo: ErrorInfo; timestamp: number }>) => void> = new Set();
  private maxErrors: number = 100;

  captureError(error: Error, errorInfo: ErrorInfo): void {
    this.errors.push({
      error,
      errorInfo,
      timestamp: Date.now(),
    });

    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    this.notify();
  }

  getErrors(): Array<{ error: Error; errorInfo: ErrorInfo; timestamp: number }> {
    return [...this.errors];
  }

  getLatestError(): { error: Error; errorInfo: ErrorInfo; timestamp: number } | undefined {
    return this.errors[this.errors.length - 1];
  }

  clearErrors(): void {
    this.errors = [];
    this.notify();
  }

  getErrorCount(): number {
    return this.errors.length;
  }

  subscribe(listener: (errors: Array<{ error: Error; errorInfo: ErrorInfo; timestamp: number }>) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getErrors());
      } catch (error) {
        console.error("Error in error boundary listener:", error);
      }
    });
  }
}

export function createErrorBoundaryManager(): ErrorBoundaryManager {
  return new ErrorBoundaryManager();
}

// Global error boundary manager
let globalErrorBoundaryManager: ErrorBoundaryManager | null = null;

export function getGlobalErrorBoundaryManager(): ErrorBoundaryManager {
  if (!globalErrorBoundaryManager) {
    globalErrorBoundaryManager = createErrorBoundaryManager();
  }
  return globalErrorBoundaryManager;
}

export function setGlobalErrorBoundaryManager(manager: ErrorBoundaryManager): void {
  globalErrorBoundaryManager = manager;
}

// Convenience functions
export function captureError(error: Error, errorInfo: ErrorInfo): void {
  getGlobalErrorBoundaryManager().captureError(error, errorInfo);
}

export function getErrors(): Array<{ error: Error; errorInfo: ErrorInfo; timestamp: number }> {
  return getGlobalErrorBoundaryManager().getErrors();
}

export function getLatestError(): { error: Error; errorInfo: ErrorInfo; timestamp: number } | undefined {
  return getGlobalErrorBoundaryManager().getLatestError();
}

export function clearErrors(): void {
  getGlobalErrorBoundaryManager().clearErrors();
}

export function getErrorCount(): number {
  return getGlobalErrorBoundaryManager().getErrorCount();
}

// Error message extraction
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unknown error occurred";
}

export function getErrorStack(error: unknown): string | undefined {
  if (error instanceof Error) {
    return error.stack;
  }
  return undefined;
}

// Error classification
export function isNetworkError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return message.includes("network") || message.includes("fetch") || message.includes("timeout");
}

export function isAuthError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return message.includes("unauthorized") || message.includes("forbidden") || message.includes("auth");
}

export function isValidationError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return message.includes("validation") || message.includes("invalid") || message.includes("required");
}

export function isRateLimitError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return message.includes("rate limit") || message.includes("too many") || message.includes("429");
}
