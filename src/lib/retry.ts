/**
 * Retry utilities
 */

interface RetryOptions {
  maxRetries: number;
  delay: number;
  backoff: "linear" | "exponential" | "fixed";
  maxDelay?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

const defaultOptions: RetryOptions = {
  maxRetries: 3,
  delay: 1000,
  backoff: "exponential",
  maxDelay: 30000,
};

function calculateDelay(attempt: number, options: RetryOptions): number {
  const { delay, backoff, maxDelay = 30000 } = options;

  let calculatedDelay: number;

  switch (backoff) {
    case "linear":
      calculatedDelay = delay * attempt;
      break;
    case "exponential":
      calculatedDelay = delay * Math.pow(2, attempt - 1);
      break;
    case "fixed":
    default:
      calculatedDelay = delay;
      break;
  }

  return Math.min(calculatedDelay, maxDelay);
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts = { ...defaultOptions, ...options };
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === opts.maxRetries) {
        throw lastError;
      }

      const delay = calculateDelay(attempt, opts);
      opts.onRetry?.(attempt, lastError);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

export async function retryWithFallback<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  try {
    return await retry(primary, options);
  } catch {
    return await fallback();
  }
}

export function createRetryable<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  options: Partial<RetryOptions> = {}
): T {
  return ((...args: Parameters<T>) => {
    return retry(() => fn(...args), options);
  }) as T;
}

export class RetryError extends Error {
  constructor(
    message: string,
    public attempts: number,
    public lastError: Error
  ) {
    super(message);
    this.name = "RetryError";
  }
}

export function isRetryableError(error: unknown): boolean {
  if (error instanceof RetryError) return true;
  if (error instanceof Error) {
    const retryableMessages = [
      "network error",
      "timeout",
      "connection refused",
      "ECONNRESET",
      "ETIMEDOUT",
      "ENOTFOUND",
    ];
    return retryableMessages.some((msg) =>
      error.message.toLowerCase().includes(msg.toLowerCase())
    );
  }
  return false;
}
