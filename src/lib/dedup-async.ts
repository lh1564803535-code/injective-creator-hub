/**
 * Async Deduplication utilities
 */

class AsyncDeduplicator {
  private seen: Set<string> = new Set();
  private pending: Map<string, Promise<unknown>> = new Map();
  private maxSize: number;

  constructor(maxSize: number = 10000) {
    this.maxSize = maxSize;
  }

  async deduplicate<T>(key: string, fn: () => Promise<T>): Promise<T> {
    // Check if already seen
    if (this.seen.has(key)) {
      throw new Error(`Duplicate key: ${key}`);
    }

    // Check if currently being processed
    if (this.pending.has(key)) {
      return this.pending.get(key) as Promise<T>;
    }

    // Process and cache
    const promise = fn().finally(() => {
      this.pending.delete(key);
      this.seen.add(key);
      this.cleanup();
    });

    this.pending.set(key, promise);
    return promise;
  }

  has(key: string): boolean {
    return this.seen.has(key) || this.pending.has(key);
  }

  remove(key: string): boolean {
    return this.seen.delete(key);
  }

  clear(): void {
    this.seen.clear();
    this.pending.clear();
  }

  getSize(): number {
    return this.seen.size;
  }

  getPendingCount(): number {
    return this.pending.size;
  }

  private cleanup(): void {
    if (this.seen.size > this.maxSize) {
      const iterator = this.seen.values();
      for (let i = 0; i < this.maxSize / 2; i++) {
        const result = iterator.next();
        if (!result.done) {
          this.seen.delete(result.value);
        }
      }
    }
  }
}

export function createAsyncDeduplicator(maxSize?: number): AsyncDeduplicator {
  return new AsyncDeduplicator(maxSize);
}

// Deduplicate async operations
export async function deduplicateAsync<T>(
  key: string,
  fn: () => Promise<T>,
  deduplicator?: AsyncDeduplicator
): Promise<T> {
  const dedup = deduplicator || new AsyncDeduplicator();
  return dedup.deduplicate(key, fn);
}

// Deduplicate API calls
export function createDeduplicatedApiCall<T>(
  apiFn: (params: unknown) => Promise<T>,
  keyFn: (params: unknown) => string
): (params: unknown) => Promise<T> {
  const deduplicator = new AsyncDeduplicator();

  return async (params: unknown) => {
    const key = keyFn(params);
    return deduplicator.deduplicate(key, () => apiFn(params));
  };
}

// Deduplicate array of async operations
export async function deduplicateArrayAsync<T>(
  items: Array<{ key: string; fn: () => Promise<T> }>,
  concurrency: number = 3
): Promise<T[]> {
  const deduplicator = new AsyncDeduplicator();
  const results: T[] = [];

  // Process in batches
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((item) => deduplicator.deduplicate(item.key, item.fn))
    );
    results.push(...batchResults);
  }

  return results;
}
