/**
 * Lock utilities
 */

class Lock {
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

export function createLock(): Lock {
  return new Lock();
}

// Mutex
class Mutex {
  private lock: Lock = new Lock();

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

export function createMutex(): Mutex {
  return new Mutex();
}

// Semaphore
class Semaphore {
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

export function createSemaphore(permits: number): Semaphore {
  return new Semaphore(permits);
}

// Read-Write Lock
class ReadWriteLock {
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

export function createReadWriteLock(): ReadWriteLock {
  return new ReadWriteLock();
}

// Lock with timeout
export async function withTimeout<T>(
  lock: Lock,
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
