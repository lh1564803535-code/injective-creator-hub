/**
 * Async Throttle utilities
 */

class AsyncThrottler<T extends unknown[]> {
  private lastExecution: number = 0;
  private pending: Promise<void> | null = null;

  constructor(
    private fn: (...args: T) => Promise<void>,
    private limit: number
  ) {}

  async execute(...args: T): Promise<void> {
    const now = Date.now();
    const timeSinceLastExecution = now - this.lastExecution;

    if (timeSinceLastExecution >= this.limit) {
      // Execute immediately
      this.lastExecution = now;
      return this.fn(...args);
    }

    // Wait for the remaining time
    const remaining = this.limit - timeSinceLastExecution;

    if (this.pending) {
      return this.pending;
    }

    this.pending = new Promise<void>((resolve) => {
      setTimeout(async () => {
        this.lastExecution = Date.now();
        await this.fn(...args);
        this.pending = null;
        resolve();
      }, remaining);
    });

    return this.pending;
  }

  isPending(): boolean {
    return this.pending !== null;
  }

  getLimit(): number {
    return this.limit;
  }

  setLimit(limit: number): void {
    this.limit = limit;
  }
}

export function createAsyncThrottler<T extends unknown[]>(
  fn: (...args: T) => Promise<void>,
  limit: number
): AsyncThrottler<T> {
  return new AsyncThrottler(fn, limit);
}

// Throttled API call
export function createThrottledApiCall(
  apiFn: (params: unknown) => Promise<unknown>,
  limit: number = 1000
): {
  call: (params: unknown) => Promise<unknown>;
  isPending: () => boolean;
} {
  let lastResult: unknown;
  let lastResolve: ((value: unknown) => void) | null = null;

  const throttler = createAsyncThrottler<[unknown]>(async (params: unknown) => {
    lastResult = await apiFn(params);
    lastResolve?.(lastResult);
  }, limit);

  return {
    call: async (params: unknown) => {
      return new Promise((resolve) => {
        lastResolve = resolve;
        throttler.execute(params);
      });
    },
    isPending: () => throttler.isPending(),
  };
}

// Throttled scroll handler
export function createThrottledScrollHandler(
  handler: (scrollY: number) => Promise<void>,
  limit: number = 100
): {
  handleScroll: () => Promise<void>;
  isPending: () => boolean;
} {
  const throttler = createAsyncThrottler<[]>(async () => {
    await handler(window.scrollY);
  }, limit);

  return {
    handleScroll: () => throttler.execute(),
    isPending: () => throttler.isPending(),
  };
}

// Throttled resize handler
export function createThrottledResizeHandler(
  handler: (width: number, height: number) => Promise<void>,
  limit: number = 200
): {
  handleResize: () => Promise<void>;
  isPending: () => boolean;
} {
  const throttler = createAsyncThrottler<[]>(async () => {
    await handler(window.innerWidth, window.innerHeight);
  }, limit);

  return {
    handleResize: () => throttler.execute(),
    isPending: () => throttler.isPending(),
  };
}
