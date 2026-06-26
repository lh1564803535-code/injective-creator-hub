/**
 * Deduplication utilities
 */

class Deduplicator {
  private seen: Set<string> = new Set();
  private maxSize: number;

  constructor(maxSize: number = 10000) {
    this.maxSize = maxSize;
  }

  isDuplicate(key: string): boolean {
    if (this.seen.has(key)) return true;
    this.seen.add(key);
    this.cleanup();
    return false;
  }

  add(key: string): boolean {
    if (this.seen.has(key)) return false;
    this.seen.add(key);
    this.cleanup();
    return true;
  }

  has(key: string): boolean {
    return this.seen.has(key);
  }

  remove(key: string): boolean {
    return this.seen.delete(key);
  }

  clear(): void {
    this.seen.clear();
  }

  getSize(): number {
    return this.seen.size;
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

export function createDeduplicator(maxSize?: number): Deduplicator {
  return new Deduplicator(maxSize);
}

// Deduplicate array
export function deduplicate<T>(array: T[], keyFn?: (item: T) => string): T[] {
  if (!keyFn) {
    return [...new Set(array)];
  }

  const seen = new Set<string>();
  return array.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Deduplicate by property
export function deduplicateBy<T>(array: T[], key: keyof T): T[] {
  return deduplicate(array, (item) => String(item[key]));
}

// Deduplicate with timestamp (keep latest)
export function deduplicateWithTimestamp<T extends { id: string; timestamp: number }>(
  array: T[]
): T[] {
  const map = new Map<string, T>();
  for (const item of array) {
    const existing = map.get(item.id);
    if (!existing || item.timestamp > existing.timestamp) {
      map.set(item.id, item);
    }
  }
  return Array.from(map.values());
}

// Global deduplicator
let globalDeduplicator: Deduplicator | null = null;

export function getGlobalDeduplicator(): Deduplicator {
  if (!globalDeduplicator) {
    globalDeduplicator = createDeduplicator();
  }
  return globalDeduplicator;
}

export function setGlobalDeduplicator(deduplicator: Deduplicator): void {
  globalDeduplicator = deduplicator;
}

// Convenience functions
export function isDuplicate(key: string): boolean {
  return getGlobalDeduplicator().isDuplicate(key);
}

export function addToDedup(key: string): boolean {
  return getGlobalDeduplicator().add(key);
}

export function hasBeenSeen(key: string): boolean {
  return getGlobalDeduplicator().has(key);
}

export function clearDedup(): void {
  getGlobalDeduplicator().clear();
}
