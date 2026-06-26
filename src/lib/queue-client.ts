/**
 * Queue Client utilities
 */

interface QueueMessage<T = unknown> {
  id: string;
  data: T;
  timestamp: number;
  attempts: number;
  maxAttempts: number;
}

interface QueueConfig {
  maxRetries: number;
  retryDelay: number;
  concurrency: number;
}

class QueueClient {
  private queue: QueueMessage[] = [];
  private processing: Map<string, QueueMessage> = new Map();
  private handlers: Map<string, (data: unknown) => Promise<void>> = new Map();
  private config: QueueConfig;

  constructor(config: QueueConfig) {
    this.config = config;
  }

  async enqueue<T>(topic: string, data: T): Promise<string> {
    const message: QueueMessage<T> = {
      id: crypto.randomUUID(),
      data,
      timestamp: Date.now(),
      attempts: 0,
      maxAttempts: this.config.maxRetries,
    };

    this.queue.push(message as QueueMessage);
    this.processQueue();
    return message.id;
  }

  registerHandler(topic: string, handler: (data: unknown) => Promise<void>): void {
    this.handlers.set(topic, handler);
  }

  private async processQueue(): Promise<void> {
    while (this.processing.size < this.config.concurrency && this.queue.length > 0) {
      const message = this.queue.shift()!;
      this.processing.set(message.id, message);
      this.processMessage(message);
    }
  }

  private async processMessage(message: QueueMessage): Promise<void> {
    try {
      const handler = this.handlers.get("default");
      if (handler) {
        await handler(message.data);
      }
      this.processing.delete(message.id);
    } catch (error) {
      message.attempts++;
      if (message.attempts < message.maxAttempts) {
        setTimeout(() => {
          this.queue.push(message);
          this.processing.delete(message.id);
          this.processQueue();
        }, this.config.retryDelay * message.attempts);
      } else {
        this.processing.delete(message.id);
        console.error(`Message ${message.id} failed after ${message.maxAttempts} attempts`);
      }
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  getProcessingSize(): number {
    return this.processing.size;
  }

  clear(): void {
    this.queue = [];
    this.processing.clear();
  }
}

export function createQueueClient(config: QueueConfig): QueueClient {
  return new QueueClient(config);
}

export function createSimpleQueue(): QueueClient {
  return createQueueClient({
    maxRetries: 3,
    retryDelay: 1000,
    concurrency: 1,
  });
}

export function createHighThroughputQueue(): QueueClient {
  return createQueueClient({
    maxRetries: 5,
    retryDelay: 500,
    concurrency: 10,
  });
}

// Global queue client
let globalQueueClient: QueueClient | null = null;

export function getGlobalQueueClient(): QueueClient {
  if (!globalQueueClient) {
    globalQueueClient = createSimpleQueue();
  }
  return globalQueueClient;
}

export function setGlobalQueueClient(client: QueueClient): void {
  globalQueueClient = client;
}

// Convenience functions
export async function enqueue<T>(topic: string, data: T): Promise<string> {
  return getGlobalQueueClient().enqueue(topic, data);
}

export function registerQueueHandler(topic: string, handler: (data: unknown) => Promise<void>): void {
  getGlobalQueueClient().registerHandler(topic, handler);
}

export function getQueueSize(): number {
  return getGlobalQueueClient().getQueueSize();
}

export function getProcessingSize(): number {
  return getGlobalQueueClient().getProcessingSize();
}

export function clearQueue(): void {
  getGlobalQueueClient().clear();
}
