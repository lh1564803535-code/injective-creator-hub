/**
 * Event Emitter utilities
 */

type EventListener = (...args: unknown[]) => void;

class EventEmitter {
  private listeners: Map<string, Set<EventListener>> = new Map();
  private maxListeners: number = 10;

  on(event: string, listener: EventListener): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const listeners = this.listeners.get(event)!;
    if (listeners.size >= this.maxListeners) {
      console.warn(`Max listeners (${this.maxListeners}) exceeded for event "${event}"`);
    }

    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  once(event: string, listener: EventListener): () => void {
    const wrappedListener: EventListener = (...args) => {
      listener(...args);
      off();
    };
    const off = this.on(event, wrappedListener);
    return off;
  }

  emit(event: string, ...args: unknown[]): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(...args);
        } catch (error) {
          console.error(`Error in event listener for "${event}":`, error);
        }
      });
    }
  }

  off(event: string, listener?: EventListener): void {
    if (!listener) {
      this.listeners.delete(event);
    } else {
      this.listeners.get(event)?.delete(listener);
      if (this.listeners.get(event)?.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  listenerCount(event: string): number {
    return this.listeners.get(event)?.size ?? 0;
  }

  eventNames(): string[] {
    return Array.from(this.listeners.keys());
  }

  hasListeners(event: string): boolean {
    return this.listenerCount(event) > 0;
  }

  setMaxListeners(max: number): void {
    this.maxListeners = max;
  }

  getMaxListeners(): number {
    return this.maxListeners;
  }
}

export function createEventEmitter(): EventEmitter {
  return new EventEmitter();
}

// Typed event emitter
export function createTypedEventEmitter<T extends Record<string, unknown[]>>(): {
  on<K extends keyof T & string>(event: K, listener: (...args: T[K]) => void): () => void;
  once<K extends keyof T & string>(event: K, listener: (...args: T[K]) => void): () => void;
  emit<K extends keyof T & string>(event: K, ...args: T[K]): void;
  off<K extends keyof T & string>(event: K, listener?: (...args: T[K]) => void): void;
  removeAllListeners<K extends keyof T & string>(event?: K): void;
  listenerCount<K extends keyof T & string>(event: K): number;
  eventNames(): string[];
} {
  const emitter = new EventEmitter();

  return {
    on<K extends keyof T & string>(event: K, listener: (...args: T[K]) => void): () => void {
      return emitter.on(event, listener as EventListener);
    },
    once<K extends keyof T & string>(event: K, listener: (...args: T[K]) => void): () => void {
      return emitter.once(event, listener as EventListener);
    },
    emit<K extends keyof T & string>(event: K, ...args: T[K]): void {
      emitter.emit(event, ...args);
    },
    off<K extends keyof T & string>(event: K, listener?: (...args: T[K]) => void): void {
      emitter.off(event, listener as EventListener);
    },
    removeAllListeners<K extends keyof T & string>(event?: K): void {
      emitter.removeAllListeners(event);
    },
    listenerCount<K extends keyof T & string>(event: K): number {
      return emitter.listenerCount(event);
    },
    eventNames(): string[] {
      return emitter.eventNames();
    },
  };
}

// Event emitter with wildcard support
export function createWildcardEventEmitter(): EventEmitter & {
  emitWildcard(event: string, ...args: unknown[]): void;
} {
  const emitter = new EventEmitter();
  const originalEmit = emitter.emit.bind(emitter);

  const emitWildcard = (event: string, ...args: unknown[]) => {
    originalEmit(event, ...args);

    // Emit wildcard event
    const parts = event.split(".");
    while (parts.length > 0) {
      const wildcardEvent = parts.join(".") + ".*";
      originalEmit(wildcardEvent, event, ...args);
      parts.pop();
    }

    // Emit global wildcard
    originalEmit("*", event, ...args);
  };

  return Object.assign(emitter, { emitWildcard });
}
