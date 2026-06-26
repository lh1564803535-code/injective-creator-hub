/**
 * Async Lock utilities
 */

class AsyncLock {
  private locked: boolean = false;
  private queue: Array<() => void> = [];

  async acquire(): Promise<void> {
    if (!this.locked) {
      this.locked = true;
      return;
    }

    return new Promise((resolve) => {
      this.queue.push(resolve);
    });
  }

  release(): void {
    if (this.queue.length > 0) {
      const next = this.queue.shift()!;
      next();
    } else {
      this.locked = false;
    }
  }

  isLocked(): boolean {
    return this.locked;
  }

  getQueueLength(): number {
    return this.queue.length;
  }
}

export function createAsyncLock(): AsyncLock {
  return new AsyncLock();
}

// Async Mutex
class AsyncMutex {
  private lock: AsyncLock = new AsyncLock();

  async runExclusive<T>(fn: () => Promise<T>): Promise<T> {
    await this.lock.acquire();
    try {
      return await fn();
    } finally {
      this.lock.release();
    }
  }

  isLocked(): boolean {
    return this.lock.isLocked();
  }
}

export function createAsyncMutex(): AsyncMutex {
  return new AsyncMutex();
}

// Async Semaphore
class AsyncSemaphore {
  private permits: number;
  private queue: Array<() => void> = [];

  constructor(permits: number) {
    this.permits = permits;
  }

  async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits--;
      return;
    }

    return new Promise((resolve) => {
      this.queue.push(resolve);
    });
  }

  release(): void {
    if (this.queue.length > 0) {
      const next = this.queue.shift()!;
      next();
    } else {
      this.permits++;
    }
  }

  getAvailablePermits(): number {
    return this.permits;
  }

  getQueueLength(): number {
    return this.queue.length;
  }
}

export function createAsyncSemaphore(permits: number): AsyncSemaphore {
  return new AsyncSemaphore(permits);
}

// Async Read-Write Lock
class AsyncReadWriteLock {
  private readers: number = 0;
  private writer: boolean = false;
  private readQueue: Array<() => void> = [];
  private writeQueue: Array<() => void> = [];

  async acquireRead(): Promise<void> {
    if (!this.writer && this.writeQueue.length === 0) {
      this.readers++;
      return;
    }

    return new Promise((resolve) => {
      this.readQueue.push(resolve);
    });
  }

  releaseRead(): void {
    this.readers--;
    if (this.readers === 0 && this.writeQueue.length > 0) {
      const next = this.writeQueue.shift()!;
      this.writer = true;
      next();
    }
  }

  async acquireWrite(): Promise<void> {
    if (!this.writer && this.readers === 0) {
      this.writer = true;
      return;
    }

    return new Promise((resolve) => {
      this.writeQueue.push(resolve);
    });
  }

  releaseWrite(): void {
    this.writer = false;
    if (this.readQueue.length > 0) {
      this.readQueue.forEach((resolve) => {
        this.readers++;
        resolve();
      });
      this.readQueue = [];
    } else if (this.writeQueue.length > 0) {
      const next = this.writeQueue.shift()!;
      this.writer = true;
      next();
    }
  }

  getReaders(): number {
    return this.readers;
  }

  isWriter(): boolean {
    return this.writer;
  }
}

export function createAsyncReadWriteLock(): AsyncReadWriteLock {
  return new AsyncReadWriteLock();
}

// Lock with timeout
export async function withAsyncTimeout<T>(
  lock: AsyncLock,
  fn: () => Promise<T>,
  timeout: number
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Lock timeout")), timeout);
  });

  await lock.acquire();
  try {
    return await Promise.race([fn(), timeoutPromise]);
  } finally {
    lock.release();
  }
}
