/**
 * Rate limiter utilities
 */

interface RateLimiterOptions {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(options: RateLimiterOptions) {
    this.maxRequests = options.maxRequests;
    this.windowMs = options.windowMs;
  }

  tryAcquire(): boolean {
    const now = Date.now();
    this.cleanup(now);

    if (this.requests.length >= this.maxRequests) {
      return false;
    }

    this.requests.push(now);
    return true;
  }

  async acquire(): Promise<void> {
    while (!this.tryAcquire()) {
      const oldestRequest = this.requests[0];
      const waitTime = oldestRequest + this.windowMs - Date.now();
      await new Promise((resolve) => setTimeout(resolve, Math.max(0, waitTime)));
    }
  }

  getRemainingRequests(): number {
    const now = Date.now();
    this.cleanup(now);
    return Math.max(0, this.maxRequests - this.requests.length);
  }

  getResetTime(): number {
    if (this.requests.length === 0) return 0;
    const oldestRequest = this.requests[0];
    return Math.max(0, oldestRequest + this.windowMs - Date.now());
  }

  private cleanup(now: number): void {
    this.requests = this.requests.filter((time) => time + this.windowMs > now);
  }

  reset(): void {
    this.requests = [];
  }
}

export function createRateLimiter(options: RateLimiterOptions): RateLimiter {
  return new RateLimiter(options);
}

export function createTokenBucket(capacity: number, refillRate: number): {
  tryConsume: (tokens?: number) => boolean;
  getAvailableTokens: () => number;
  reset: () => void;
} {
  let tokens = capacity;
  let lastRefill = Date.now();

  const refill = () => {
    const now = Date.now();
    const elapsed = now - lastRefill;
    const newTokens = Math.floor(elapsed / 1000) * refillRate;
    tokens = Math.min(capacity, tokens + newTokens);
    lastRefill = now;
  };

  return {
    tryConsume(tokensToConsume: number = 1): boolean {
      refill();
      if (tokens >= tokensToConsume) {
        tokens -= tokensToConsume;
        return true;
      }
      return false;
    },

    getAvailableTokens(): number {
      refill();
      return tokens;
    },

    reset(): void {
      tokens = capacity;
      lastRefill = Date.now();
    },
  };
}

export function throttleByRate<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limiter: RateLimiter
): (...args: Parameters<T>) => boolean {
  return (...args: Parameters<T>): boolean => {
    if (limiter.tryAcquire()) {
      fn(...args);
      return true;
    }
    return false;
  };
}
