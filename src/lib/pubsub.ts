/**
 * Pub/Sub utilities
 */

type Handler<T> = (data: T) => void;

class EventBus {
  private events: Map<string, Set<Handler<unknown>>> = new Map();

  on<T>(event: string, handler: Handler<T>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(handler as Handler<unknown>);

    return () => {
      this.events.get(event)?.delete(handler as Handler<unknown>);
      if (this.events.get(event)?.size === 0) {
        this.events.delete(event);
      }
    };
  }

  once<T>(event: string, handler: Handler<T>): () => void {
    const wrappedHandler = ((data: T) => {
      handler(data);
      off();
    }) as Handler<T>;

    const off = this.on(event, wrappedHandler);
    return off;
  }

  emit<T>(event: string, data: T): void {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          (handler as Handler<T>)(data);
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error);
        }
      });
    }
  }

  off(event: string, handler?: Handler<unknown>): void {
    if (!handler) {
      this.events.delete(event);
    } else {
      this.events.get(event)?.delete(handler);
      if (this.events.get(event)?.size === 0) {
        this.events.delete(event);
      }
    }
  }

  has(event: string): boolean {
    return this.events.has(event) && this.events.get(event)!.size > 0;
  }

  listenerCount(event: string): number {
    return this.events.get(event)?.size ?? 0;
  }

  eventNames(): string[] {
    return Array.from(this.events.keys());
  }

  clear(): void {
    this.events.clear();
  }
}

export const eventBus = new EventBus();

export function createEventBus(): EventBus {
  return new EventBus();
}

export function createTypedEventBus<TEvents extends Record<string, unknown>>() {
  const bus = new EventBus();

  return {
    on<K extends keyof TEvents & string>(
      event: K,
      handler: Handler<TEvents[K]>
    ): () => void {
      return bus.on(event, handler);
    },

    once<K extends keyof TEvents & string>(
      event: K,
      handler: Handler<TEvents[K]>
    ): () => void {
      return bus.once(event, handler);
    },

    emit<K extends keyof TEvents & string>(
      event: K,
      data: TEvents[K]
    ): void {
      bus.emit(event, data);
    },

    off<K extends keyof TEvents & string>(
      event: K,
      handler?: Handler<TEvents[K]>
    ): void {
      bus.off(event, handler as Handler<unknown>);
    },

    has<K extends keyof TEvents & string>(event: K): boolean {
      return bus.has(event);
    },

    clear(): void {
      bus.clear();
    },
  };
}
