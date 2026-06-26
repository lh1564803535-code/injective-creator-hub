/**
 * Async Cache utilities
 */

interface AsyncCacheConfig {
  ttl: number;
  maxSize: number;
  strategy: "lru" | "fifo" | "lfu";
}

interface AsyncCacheEntry<T> {
  key: string;
  value: T;
  expiry: number;
  accessCount: number;
  lastAccessed: number;
  createdAt: number;
}

class AsyncCache {
  private cache: Map<string, AsyncCacheEntry<unknown>> = new Map();
  private config: AsyncCacheConfig;

  constructor(config: AsyncCacheConfig) {
    this.config = config;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.evictIfNeeded();

    const now = Date.now();
    this.cache.set(key, {
      key,
      value,
      expiry: now + (ttl || this.config.ttl),
      accessCount: 0,
      lastAccessed: now,
      createdAt: now,
    });
  }

  async get<T>(key: string): Promise<T | undefined> {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    entry.accessCount++;
    entry.lastAccessed = Date.now();
    return entry.value as T;
  }

  async has(key: string): Promise<boolean> {
    return (await this.get(key)) !== undefined;
  }

  async delete(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async getSize(): Promise<number> {
    await this.cleanup();
    return this.cache.size;
  }

  async getKeys(): Promise<string[]> {
    await this.cleanup();
    return Array.from(this.cache.keys());
  }

  private async evictIfNeeded(): Promise<void> {
    await this.cleanup();

    while (this.cache.size >= this.config.maxSize) {
      await this.evict();
    }
  }

  private async evict(): Promise<void> {
    let target: string | null = null;

    switch (this.config.strategy) {
      case "lru": {
        let oldest = Infinity;
        for (const [key, entry] of this.cache) {
          if (entry.lastAccessed < oldest) {
            oldest = entry.lastAccessed;
            target = key;
          }
        }
        break;
      }
      case "fifo": {
        let oldest = Infinity;
        for (const [key, entry] of this.cache) {
          if (entry.createdAt < oldest) {
            oldest = entry.createdAt;
            target = key;
          }
        }
        break;
      }
      case "lfu": {
        let leastFrequent = Infinity;
        for (const [key, entry] of this.cache) {
          if (entry.accessCount < leastFrequent) {
            leastFrequent = entry.accessCount;
            target = key;
          }
        }
        break;
      }
    }

    if (target) {
      this.cache.delete(target);
    }
  }

  private async cleanup(): Promise<void> {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

export function createAsyncCache(config: AsyncCacheConfig): AsyncCache {
  return new AsyncCache(config);
}

export function createAsyncLruCache(maxSize: number, ttl: number = 60000): AsyncCache {
  return createAsyncCache({ ttl, maxSize, strategy: "lru" });
}

export function createAsyncFifoCache(maxSize: number, ttl: number = 60000): AsyncCache {
  return createAsyncCache({ ttl, maxSize, strategy: "fifo" });
}

export function createAsyncLfuCache(maxSize: number, ttl: number = 60000): AsyncCache {
  return createAsyncCache({ ttl, maxSize, strategy: "lfu" });
}

// Async cached function wrapper
export function cachedAsync<T>(
  cache: AsyncCache,
  key: string,
  fn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      const cached = await cache.get<T>(key);
      if (cached !== undefined) {
        resolve(cached);
        return;
      }

      const value = await fn();
      await cache.set(key, value, ttl);
      resolve(value);
    } catch (error) {
      reject(error);
    }
  });
}
