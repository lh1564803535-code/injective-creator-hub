/**
 * Batch processing utilities
 */

interface BatchConfig {
  maxSize: number;
  flushInterval: number; // milliseconds
  autoFlush: boolean;
}

class BatchProcessor<T> {
  private items: T[] = [];
  private config: BatchConfig;
  private handler: (items: T[]) => Promise<void>;
  private flushTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(config: BatchConfig, handler: (items: T[]) => Promise<void>) {
    this.config = config;
    this.handler = handler;
  }

  add(item: T): void {
    this.items.push(item);

    if (this.items.length >= this.config.maxSize) {
      this.flush();
    } else if (this.config.autoFlush && !this.flushTimer) {
      this.flushTimer = setTimeout(() => this.flush(), this.config.flushInterval);
    }
  }

  async flush(): Promise<void> {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    if (this.items.length === 0) return;

    const batch = [...this.items];
    this.items = [];

    try {
      await this.handler(batch);
    } catch (error) {
      console.error("Batch processing error:", error);
      // Re-add failed items
      this.items.unshift(...batch);
    }
  }

  getSize(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }
}

export function createBatchProcessor<T>(
  config: BatchConfig,
  handler: (items: T[]) => Promise<void>
): BatchProcessor<T> {
  return new BatchProcessor(config, handler);
}

export function createBatchProcessorSimple<T>(
  handler: (items: T[]) => Promise<void>,
  maxSize: number = 100,
  flushInterval: number = 5000
): BatchProcessor<T> {
  return new BatchProcessor(
    { maxSize, flushInterval, autoFlush: true },
    handler
  );
}

// Batch array operations
export function batchArray<T>(array: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    batches.push(array.slice(i, i + size));
  }
  return batches;
}

export async function processBatch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10
): Promise<R[]> {
  const batches = batchArray(items, batchSize);
  const results: R[] = [];

  for (const batch of batches) {
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }

  return results;
}

export async function processBatchSequential<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10
): Promise<R[]> {
  const batches = batchArray(items, batchSize);
  const results: R[] = [];

  for (const batch of batches) {
    for (const item of batch) {
      results.push(await processor(item));
    }
  }

  return results;
}

// Debounce batch
export function debounceBatch<T>(
  handler: (items: T[]) => void,
  delay: number
): (item: T) => void {
  let items: T[] = [];
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (item: T) => {
    items.push(item);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      handler([...items]);
      items = [];
      timeoutId = null;
    }, delay);
  };
}
