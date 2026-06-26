/**
 * Async Pool utilities
 */

interface AsyncPoolConfig<T> {
  factory: () => Promise<T>;
  destroy: (item: T) => Promise<void>;
  validate?: (item: T) => Promise<boolean>;
  maxSize: number;
  minSize: number;
}

class AsyncPool<T> {
  private available: T[] = [];
  private inUse: Set<T> = new Set();
  private config: AsyncPoolConfig<T>;
  private initialized: boolean = false;

  constructor(config: AsyncPoolConfig<T>) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    for (let i = 0; i < this.config.minSize; i++) {
      const item = await this.config.factory();
      this.available.push(item);
    }

    this.initialized = true;
  }

  async acquire(): Promise<T> {
    if (!this.initialized) {
      await this.initialize();
    }

    let item: T;

    if (this.available.length > 0) {
      item = this.available.pop()!;
    } else if (this.inUse.size < this.config.maxSize) {
      item = await this.config.factory();
    } else {
      throw new Error("Pool exhausted");
    }

    // Validate if validator exists
    if (this.config.validate) {
      const isValid = await this.config.validate(item);
      if (!isValid) {
        await this.config.destroy(item);
        return this.acquire();
      }
    }

    this.inUse.add(item);
    return item;
  }

  release(item: T): void {
    if (!this.inUse.has(item)) return;

    this.inUse.delete(item);

    if (this.available.length < this.config.maxSize) {
      this.available.push(item);
    } else {
      this.config.destroy(item);
    }
  }

  async destroy(item: T): Promise<void> {
    this.inUse.delete(item);
    await this.config.destroy(item);
  }

  getAvailableCount(): number {
    return this.available.length;
  }

  getInUseCount(): number {
    return this.inUse.size;
  }

  getTotalCount(): number {
    return this.available.length + this.inUse.size;
  }

  async clear(): Promise<void> {
    for (const item of this.available) {
      await this.config.destroy(item);
    }
    for (const item of this.inUse) {
      await this.config.destroy(item);
    }
    this.available = [];
    this.inUse.clear();
  }
}

export function createAsyncPool<T>(config: AsyncPoolConfig<T>): AsyncPool<T> {
  return new AsyncPool(config);
}

export function createSimpleAsyncPool<T>(
  factory: () => Promise<T>,
  destroy: (item: T) => Promise<void>,
  maxSize: number = 10
): AsyncPool<T> {
  return new AsyncPool({
    factory,
    destroy,
    maxSize,
    minSize: Math.min(1, maxSize),
  });
}

// Pool with auto-release
export async function withAsyncPool<T, R>(pool: AsyncPool<T>, fn: (item: T) => Promise<R>): Promise<R> {
  const item = await pool.acquire();
  try {
    return await fn(item);
  } finally {
    pool.release(item);
  }
}
