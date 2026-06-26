/**
 * Cache utilities
 */

interface CacheEntry<T> {
  value: T;
  expiry: number;
  createdAt: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private maxSize: number = 1000;

  set<T>(key: string, value: T, ttl: number = 60000): void {
    if (this.cache.size >= this.maxSize) {
      this.evictExpired();
    }

    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl,
      createdAt: Date.now(),
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  evictExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    missRate: number;
  } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0,
      missRate: 0,
    };
  }
}

export const cache = new MemoryCache();

export function cached<T>(
  key: string,
  fn: () => T,
  ttl: number = 60000
): T {
  const cachedValue = cache.get<T>(key);
  if (cachedValue !== null) return cachedValue;

  const value = fn();
  cache.set(key, value, ttl);
  return value;
}

export async function cachedAsync<T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = 60000
): Promise<T> {
  const cachedValue = cache.get<T>(key);
  if (cachedValue !== null) return cachedValue;

  const value = await fn();
  cache.set(key, value, ttl);
  return value;
}

export function createCacheKey(...parts: (string | number | boolean)[]): string {
  return parts.join(":");
}

export function invalidatePattern(pattern: string): void {
  const regex = new RegExp(pattern);
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key);
    }
  }
}
