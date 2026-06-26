/**
 * Observer utilities
 */

interface Observer<T> {
  update: (data: T) => void;
}

class Subject<T> {
  private observers: Set<Observer<T>> = new Set();

  attach(observer: Observer<T>): void {
    this.observers.add(observer);
  }

  detach(observer: Observer<T>): void {
    this.observers.delete(observer);
  }

  notify(data: T): void {
    this.observers.forEach((observer) => {
      try {
        observer.update(data);
      } catch (error) {
        console.error("Error in observer:", error);
      }
    });
  }

  getObserverCount(): number {
    return this.observers.size;
  }

  clear(): void {
    this.observers.clear();
  }
}

export function createSubject<T>(): Subject<T> {
  return new Subject<T>();
}

export function createObserver<T>(
  updateFn: (data: T) => void
): Observer<T> {
  return { update: updateFn };
}

export function createObservable<T>(initialValue: T) {
  const subject = createSubject<T>();
  let value = initialValue;

  return {
    get: () => value,
    set: (newValue: T) => {
      value = newValue;
      subject.notify(value);
    },
    subscribe: (observer: Observer<T>) => {
      subject.attach(observer);
      return () => subject.detach(observer);
    },
    getObserverCount: () => subject.getObserverCount(),
  };
}

export class EventEmitter<T extends Record<string, unknown>> {
  private listeners: Map<keyof T, Set<(data: T[keyof T]) => void>> = new Map();

  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener as (data: T[keyof T]) => void);

    return () => {
      this.listeners.get(event)?.delete(listener as (data: T[keyof T]) => void);
    };
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          (listener as (data: T[K]) => void)(data);
        } catch (error) {
          console.error(`Error in event listener for ${String(event)}:`, error);
        }
      });
    }
  }

  off<K extends keyof T>(event: K, listener?: (data: T[K]) => void): void {
    if (!listener) {
      this.listeners.delete(event);
    } else {
      this.listeners.get(event)?.delete(listener as (data: T[keyof T]) => void);
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}

export function createEventEmitter<T extends Record<string, unknown>>(): EventEmitter<T> {
  return new EventEmitter<T>();
}
