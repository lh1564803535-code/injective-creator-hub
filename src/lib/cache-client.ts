/**
 * Cache Client utilities
 */

interface CacheConfig {
  ttl: number; // milliseconds
  maxSize: number;
  strategy: "lru" | "fifo" | "lfu";
}

interface CacheEntry<T> {
  key: string;
  value: T;
  expiry: number;
  accessCount: number;
  lastAccessed: number;
  createdAt: number;
}

class CacheClient {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.config = config;
  }

  set<T>(key: string, value: T, ttl?: number): void {
    this.evictIfNeeded();

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

  get<T>(key: string): T | undefined {
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

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  getSize(): number {
    this.cleanup();
    return this.cache.size;
  }

  getKeys(): string[] {
    this.cleanup();
    return Array.from(this.cache.keys());
  }

  private evictIfNeeded(): void {
    this.cleanup();

    while (this.cache.size >= this.config.maxSize) {
      this.evict();
    }
  }

  private evict(): void {
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

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

export function createCacheClient(config: CacheConfig): CacheClient {
  return new CacheClient(config);
}

export function createLruCache(maxSize: number, ttl: number = 60000): CacheClient {
  return createCacheClient({ ttl, maxSize, strategy: "lru" });
}

export function createFifoCache(maxSize: number, ttl: number = 60000): CacheClient {
  return createCacheClient({ ttl, maxSize, strategy: "fifo" });
}

export function createLfuCache(maxSize: number, ttl: number = 60000): CacheClient {
  return createCacheClient({ ttl, maxSize, strategy: "lfu" });
}

// Global cache client
let globalCacheClient: CacheClient | null = null;

export function getGlobalCacheClient(): CacheClient {
  if (!globalCacheClient) {
    globalCacheClient = createLruCache(1000);
  }
  return globalCacheClient;
}

export function setGlobalCacheClient(client: CacheClient): void {
  globalCacheClient = client;
}

// Convenience functions
export function cacheSet<T>(key: string, value: T, ttl?: number): void {
  getGlobalCacheClient().set(key, value, ttl);
}

export function cacheGet<T>(key: string): T | undefined {
  return getGlobalCacheClient().get<T>(key);
}

export function cacheHas(key: string): boolean {
  return getGlobalCacheClient().has(key);
}

export function cacheDelete(key: string): boolean {
  return getGlobalCacheClient().delete(key);
}

export function cacheClear(): void {
  getGlobalCacheClient().clear();
}

// Cached function wrapper
export function cached<T>(key: string, fn: () => T, ttl?: number): T {
  const cached = cacheGet<T>(key);
  if (cached !== undefined) return cached;

  const value = fn();
  cacheSet(key, value, ttl);
  return value;
}

export async function cachedAsync<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
  const cached = cacheGet<T>(key);
  if (cached !== undefined) return cached;

  const value = await fn();
  cacheSet(key, value, ttl);
  return value;
}
