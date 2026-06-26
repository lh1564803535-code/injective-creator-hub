/**
 * Message Queue utilities
 */

interface Message<T = unknown> {
  id: string;
  topic: string;
  payload: T;
  timestamp: number;
  headers?: Record<string, string>;
}

type MessageHandler<T = unknown> = (message: Message<T>) => Promise<void>;

class MessageQueue {
  private queues: Map<string, Message[]> = new Map();
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private processing: Map<string, boolean> = new Map();

  async publish<T>(topic: string, payload: T, headers?: Record<string, string>): Promise<void> {
    const message: Message<T> = {
      id: crypto.randomUUID(),
      topic,
      payload,
      timestamp: Date.now(),
      headers,
    };

    if (!this.queues.has(topic)) {
      this.queues.set(topic, []);
    }
    this.queues.get(topic)!.push(message);

    // Process immediately if handlers exist
    await this.processTopic(topic);
  }

  subscribe<T>(topic: string, handler: MessageHandler<T>): () => void {
    if (!this.handlers.has(topic)) {
      this.handlers.set(topic, new Set());
    }
    this.handlers.get(topic)!.add(handler as MessageHandler);

    // Start processing if not already
    this.processTopic(topic);

    return () => {
      this.handlers.get(topic)?.delete(handler as MessageHandler);
    };
  }

  private async processTopic(topic: string): Promise<void> {
    if (this.processing.get(topic)) return;
    this.processing.set(topic, true);

    const queue = this.queues.get(topic) || [];
    const handlers = this.handlers.get(topic);

    if (!handlers || handlers.size === 0) {
      this.processing.set(topic, false);
      return;
    }

    while (queue.length > 0) {
      const message = queue.shift()!;
      for (const handler of handlers) {
        try {
          await handler(message);
        } catch (error) {
          console.error(`Error processing message on topic "${topic}":`, error);
        }
      }
    }

    this.processing.set(topic, false);
  }

  getQueueSize(topic: string): number {
    return this.queues.get(topic)?.length ?? 0;
  }

  getTopics(): string[] {
    return Array.from(new Set([
      ...Array.from(this.queues.keys()),
      ...Array.from(this.handlers.keys()),
    ]));
  }

  clear(topic?: string): void {
    if (topic) {
      this.queues.delete(topic);
    } else {
      this.queues.clear();
    }
  }

  clearAll(): void {
    this.queues.clear();
    this.handlers.clear();
    this.processing.clear();
  }
}

export function createMessageQueue(): MessageQueue {
  return new MessageQueue();
}

export function createMessage<T>(
  topic: string,
  payload: T,
  headers?: Record<string, string>
): Message<T> {
  return {
    id: crypto.randomUUID(),
    topic,
    payload,
    timestamp: Date.now(),
    headers,
  };
}

// Topic-based pub/sub
class TopicPubSub {
  private subscribers: Map<string, Set<(data: unknown) => void>> = new Map();

  publish<T>(topic: string, data: T): void {
    const subscribers = this.subscribers.get(topic);
    if (subscribers) {
      subscribers.forEach((subscriber) => {
        try {
          subscriber(data);
        } catch (error) {
          console.error(`Error in subscriber for topic "${topic}":`, error);
        }
      });
    }
  }

  subscribe<T>(topic: string, subscriber: (data: T) => void): () => void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }
    this.subscribers.get(topic)!.add(subscriber as (data: unknown) => void);

    return () => {
      this.subscribers.get(topic)?.delete(subscriber as (data: unknown) => void);
    };
  }

  hasSubscribers(topic: string): boolean {
    return (this.subscribers.get(topic)?.size ?? 0) > 0;
  }

  getSubscriberCount(topic: string): number {
    return this.subscribers.get(topic)?.size ?? 0;
  }

  getTopics(): string[] {
    return Array.from(this.subscribers.keys());
  }

  clear(): void {
    this.subscribers.clear();
  }
}

export function createTopicPubSub(): TopicPubSub {
  return new TopicPubSub();
}
