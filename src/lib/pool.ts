/**
 * Pool utilities
 */

interface PoolConfig<T> {
  factory: () => T;
  destroy: (item: T) => void;
  validate?: (item: T) => boolean;
  maxSize: number;
  minSize: number;
}

class Pool<T> {
  private available: T[] = [];
  private inUse: Set<T> = new Set();
  private config: PoolConfig<T>;

  constructor(config: PoolConfig<T>) {
    this.config = config;
    this.initialize();
  }

  private initialize(): void {
    for (let i = 0; i < this.config.minSize; i++) {
      this.available.push(this.config.factory());
    }
  }

  acquire(): T {
    let item: T;

    if (this.available.length > 0) {
      item = this.available.pop()!;
    } else if (this.inUse.size < this.config.maxSize) {
      item = this.config.factory();
    } else {
      throw new Error("Pool exhausted");
    }

    // Validate if validator exists
    if (this.config.validate && !this.config.validate(item)) {
      this.config.destroy(item);
      return this.acquire();
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

  destroy(item: T): void {
    this.inUse.delete(item);
    this.config.destroy(item);
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

  clear(): void {
    this.available.forEach((item) => this.config.destroy(item));
    this.inUse.forEach((item) => this.config.destroy(item));
    this.available = [];
    this.inUse.clear();
  }
}

export function createPool<T>(config: PoolConfig<T>): Pool<T> {
  return new Pool(config);
}

export function createSimplePool<T>(factory: () => T, maxSize: number = 10): Pool<T> {
  return new Pool({
    factory,
    destroy: () => {},
    maxSize,
    minSize: Math.min(1, maxSize),
  });
}

// Pool with auto-release
export function withPool<T, R>(pool: Pool<T>, fn: (item: T) => R): R {
  const item = pool.acquire();
  try {
    return fn(item);
  } finally {
    pool.release(item);
  }
}

export async function withPoolAsync<T, R>(pool: Pool<T>, fn: (item: T) => Promise<R>): Promise<R> {
  const item = pool.acquire();
  try {
    return await fn(item);
  } finally {
    pool.release(item);
  }
}
