/**
 * Async Debounce utilities
 */

class AsyncDebouncer<T extends unknown[]> {
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private resolve: ((value: void) => void) | null = null;
  private reject: ((reason: unknown) => void) | null = null;

  constructor(
    private fn: (...args: T) => Promise<void>,
    private delay: number
  ) {}

  async execute(...args: T): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Cancel previous execution
      this.cancel();

      this.resolve = resolve;
      this.reject = reject;

      this.timeoutId = setTimeout(async () => {
        try {
          await this.fn(...args);
          this.resolve?.();
        } catch (error) {
          this.reject?.(error);
        } finally {
          this.timeoutId = null;
          this.resolve = null;
          this.reject = null;
        }
      }, this.delay);
    });
  }

  cancel(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.resolve?.();
    this.resolve = null;
    this.reject = null;
  }

  isPending(): boolean {
    return this.timeoutId !== null;
  }

  getDelay(): number {
    return this.delay;
  }

  setDelay(delay: number): void {
    this.delay = delay;
  }
}

export function createAsyncDebouncer<T extends unknown[]>(
  fn: (...args: T) => Promise<void>,
  delay: number
): AsyncDebouncer<T> {
  return new AsyncDebouncer(fn, delay);
}

// Debounced search
export function createDebouncedSearch(
  searchFn: (query: string) => Promise<void>,
  delay: number = 300
): {
  search: (query: string) => Promise<void>;
  cancel: () => void;
  isPending: () => boolean;
} {
  const debouncer = createAsyncDebouncer<[string]>(searchFn, delay);

  return {
    search: (query: string) => debouncer.execute(query),
    cancel: () => debouncer.cancel(),
    isPending: () => debouncer.isPending(),
  };
}

// Debounced save
export function createDebouncedSave(
  saveFn: (data: unknown) => Promise<void>,
  delay: number = 1000
): {
  save: (data: unknown) => Promise<void>;
  cancel: () => void;
  isPending: () => boolean;
} {
  const debouncer = createAsyncDebouncer<[unknown]>(saveFn, delay);

  return {
    save: (data: unknown) => debouncer.execute(data),
    cancel: () => debouncer.cancel(),
    isPending: () => debouncer.isPending(),
  };
}

// Debounced API call
export function createDebouncedApiCall(
  apiFn: (params: unknown) => Promise<unknown>,
  delay: number = 500
): {
  call: (params: unknown) => Promise<unknown>;
  cancel: () => void;
  isPending: () => boolean;
} {
  let lastResult: unknown;
  let lastResolve: ((value: unknown) => void) | null = null;

  const debouncer = createAsyncDebouncer<[unknown]>(async (params: unknown) => {
    lastResult = await apiFn(params);
    lastResolve?.(lastResult);
  }, delay);

  return {
    call: async (params: unknown) => {
      return new Promise((resolve) => {
        lastResolve = resolve;
        debouncer.execute(params);
      });
    },
    cancel: () => debouncer.cancel(),
    isPending: () => debouncer.isPending(),
  };
}
