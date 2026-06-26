/**
 * Async Batch utilities
 */

interface AsyncBatchConfig {
  maxSize: number;
  flushInterval: number;
  autoFlush: boolean;
}

class AsyncBatchProcessor<T> {
  private items: T[] = [];
  private config: AsyncBatchConfig;
  private handler: (items: T[]) => Promise<void>;
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private processing: boolean = false;

  constructor(config: AsyncBatchConfig, handler: (items: T[]) => Promise<void>) {
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

    if (this.items.length === 0 || this.processing) return;

    const batch = [...this.items];
    this.items = [];
    this.processing = true;

    try {
      await this.handler(batch);
    } catch (error) {
      console.error("Async batch processing error:", error);
      // Re-add failed items
      this.items.unshift(...batch);
    } finally {
      this.processing = false;
    }
  }

  getSize(): number {
    return this.items.length;
  }

  isProcessing(): boolean {
    return this.processing;
  }

  clear(): void {
    this.items = [];
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }
}

export function createAsyncBatchProcessor<T>(
  config: AsyncBatchConfig,
  handler: (items: T[]) => Promise<void>
): AsyncBatchProcessor<T> {
  return new AsyncBatchProcessor(config, handler);
}

export function createAsyncBatchProcessorSimple<T>(
  handler: (items: T[]) => Promise<void>,
  maxSize: number = 100,
  flushInterval: number = 5000
): AsyncBatchProcessor<T> {
  return new AsyncBatchProcessor(
    { maxSize, flushInterval, autoFlush: true },
    handler
  );
}

// Async batch array operations
export function batchArray<T>(array: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    batches.push(array.slice(i, i + size));
  }
  return batches;
}

export async function processBatchAsync<T, R>(
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

export async function processBatchSequentialAsync<T, R>(
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

// Debounced batch
export function debounceBatchAsync<T>(
  handler: (items: T[]) => Promise<void>,
  delay: number
): {
  add: (item: T) => void;
  flush: () => Promise<void>;
  getSize: () => number;
} {
  let items: T[] = [];
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const flush = async () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    if (items.length === 0) return;

    const batch = [...items];
    items = [];

    await handler(batch);
  };

  return {
    add: (item: T) => {
      items.push(item);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(flush, delay);
    },
    flush,
    getSize: () => items.length,
  };
}
