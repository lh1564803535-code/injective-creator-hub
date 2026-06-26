/**
 * Circuit breaker utilities
 */

type CircuitState = "closed" | "open" | "half-open";

interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeout: number;
  halfOpenMaxAttempts: number;
}

class CircuitBreaker {
  private state: CircuitState = "closed";
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private halfOpenAttempts: number = 0;
  private options: CircuitBreakerOptions;

  constructor(options: CircuitBreakerOptions) {
    this.options = options;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.lastFailureTime >= this.options.resetTimeout) {
        this.state = "half-open";
        this.halfOpenAttempts = 0;
      } else {
        throw new Error("Circuit breaker is open");
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    if (this.state === "half-open") {
      this.halfOpenAttempts++;
      if (this.halfOpenAttempts >= this.options.halfOpenMaxAttempts) {
        this.state = "closed";
        this.failureCount = 0;
      }
    } else {
      this.failureCount = 0;
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === "half-open") {
      this.state = "open";
    } else if (this.failureCount >= this.options.failureThreshold) {
      this.state = "open";
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  getFailureCount(): number {
    return this.failureCount;
  }

  reset(): void {
    this.state = "closed";
    this.failureCount = 0;
    this.lastFailureTime = 0;
    this.halfOpenAttempts = 0;
  }
}

export function createCircuitBreaker(options: CircuitBreakerOptions): CircuitBreaker {
  return new CircuitBreaker(options);
}

export function createSimpleCircuitBreaker(
  failureThreshold: number = 5,
  resetTimeout: number = 60000
): CircuitBreaker {
  return new CircuitBreaker({
    failureThreshold,
    resetTimeout,
    halfOpenMaxAttempts: 3,
  });
}

export function withCircuitBreaker<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  options: CircuitBreakerOptions
): T {
  const breaker = new CircuitBreaker(options);

  return ((...args: Parameters<T>) => {
    return breaker.execute(() => fn(...args));
  }) as T;
}
