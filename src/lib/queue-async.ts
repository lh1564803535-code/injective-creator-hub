/**
 * Async Queue utilities
 */

interface AsyncQueueConfig {
  concurrency: number;
  maxRetries: number;
  retryDelay: number;
}

class AsyncQueue<T> {
  private queue: Array<() => Promise<T>> = [];
  private running: number = 0;
  private config: AsyncQueueConfig;
  private results: T[] = [];
  private errors: Error[] = [];

  constructor(config: AsyncQueueConfig) {
    this.config = config;
  }

  async add(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const wrappedTask = async () => {
        let lastError: Error | undefined;

        for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
          try {
            const result = await task();
            this.results.push(result);
            resolve(result);
            return result;
          } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            if (attempt < this.config.maxRetries) {
              await new Promise((r) => setTimeout(r, this.config.retryDelay * (attempt + 1)));
            }
          }
        }

        this.errors.push(lastError!);
        reject(lastError);
      };

      this.queue.push(wrappedTask);
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    while (this.running < this.config.concurrency && this.queue.length > 0) {
      const task = this.queue.shift()!;
      this.running++;

      task().finally(() => {
        this.running--;
        this.processQueue();
      });
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  getRunningCount(): number {
    return this.running;
  }

  getResults(): T[] {
    return [...this.results];
  }

  getErrors(): Error[] {
    return [...this.errors];
  }

  clear(): void {
    this.queue = [];
  }
}

export function createAsyncQueue<T>(config: AsyncQueueConfig): AsyncQueue<T> {
  return new AsyncQueue(config);
}

export function createSimpleAsyncQueue<T>(concurrency: number = 3): AsyncQueue<T> {
  return new AsyncQueue({
    concurrency,
    maxRetries: 3,
    retryDelay: 1000,
  });
}

export function createHighThroughputAsyncQueue<T>(concurrency: number = 10): AsyncQueue<T> {
  return new AsyncQueue({
    concurrency,
    maxRetries: 5,
    retryDelay: 500,
  });
}

// Process array with async queue
export async function processWithQueue<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  concurrency: number = 3
): Promise<R[]> {
  const queue = createSimpleAsyncQueue<R>(concurrency);
  const promises = items.map((item) => queue.add(() => processor(item)));
  return Promise.all(promises);
}

// Process array with async queue (sequential batches)
export async function processWithQueueSequential<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10
): Promise<R[]> {
  const results: R[] = [];
  const batches = [];

  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }

  return results;
}
