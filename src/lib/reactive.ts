/**
 * Reactive programming utilities
 */

type Subscriber<T> = (value: T) => void;
type Unsubscribe = () => void;

class Observable<T> {
  private subscribers: Set<Subscriber<T>> = new Set();

  subscribe(subscriber: Subscriber<T>): Unsubscribe {
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber);
  }

  next(value: T): void {
    this.subscribers.forEach((subscriber) => {
      try {
        subscriber(value);
      } catch (error) {
        console.error("Error in subscriber:", error);
      }
    });
  }

  getSubscriberCount(): number {
    return this.subscribers.size;
  }

  clear(): void {
    this.subscribers.clear();
  }
}

export function createObservable<T>(): Observable<T> {
  return new Observable<T>();
}

export function fromEvent<K extends keyof WindowEventMap>(
  event: K
): Observable<WindowEventMap[K]> {
  const observable = createObservable<WindowEventMap[K]>();
  const handler = (e: WindowEventMap[K]) => observable.next(e);
  window.addEventListener(event, handler);
  return observable;
}

export function fromInterval(ms: number): Observable<number> {
  const observable = createObservable<number>();
  let count = 0;
  const intervalId = setInterval(() => observable.next(count++), ms);
  return observable;
}

export function fromTimeout(ms: number): Observable<void> {
  const observable = createObservable<void>();
  setTimeout(() => observable.next(undefined), ms);
  return observable;
}

export function fromPromise<T>(promise: Promise<T>): Observable<T> {
  const observable = createObservable<T>();
  promise.then((value) => observable.next(value));
  return observable;
}

export function map<T, U>(observable: Observable<T>, fn: (value: T) => U): Observable<U> {
  const mapped = createObservable<U>();
  observable.subscribe((value) => mapped.next(fn(value)));
  return mapped;
}

export function filter<T>(observable: Observable<T>, predicate: (value: T) => boolean): Observable<T> {
  const filtered = createObservable<T>();
  observable.subscribe((value) => {
    if (predicate(value)) filtered.next(value);
  });
  return filtered;
}

export function merge<T>(...observables: Observable<T>[]): Observable<T> {
  const merged = createObservable<T>();
  observables.forEach((obs) => obs.subscribe((value) => merged.next(value)));
  return merged;
}

export function concat<T>(...observables: Observable<T>[]): Observable<T> {
  const concatenated = createObservable<T>();
  let index = 0;

  function subscribeNext() {
    if (index >= observables.length) return;
    observables[index].subscribe((value) => {
      concatenated.next(value);
    });
    index++;
    subscribeNext();
  }

  subscribeNext();
  return concatenated;
}

export function take<T>(observable: Observable<T>, count: number): Observable<T> {
  const taken = createObservable<T>();
  let taken_count = 0;
  observable.subscribe((value) => {
    if (taken_count < count) {
      taken.next(value);
      taken_count++;
    }
  });
  return taken;
}

export function skip<T>(observable: Observable<T>, count: number): Observable<T> {
  const skipped = createObservable<T>();
  let skipped_count = 0;
  observable.subscribe((value) => {
    if (skipped_count >= count) {
      skipped.next(value);
    }
    skipped_count++;
  });
  return skipped;
}

export function distinct<T>(observable: Observable<T>): Observable<T> {
  const distinct = createObservable<T>();
  const seen = new Set<T>();
  observable.subscribe((value) => {
    if (!seen.has(value)) {
      seen.add(value);
      distinct.next(value);
    }
  });
  return distinct;
}

export function debounce<T>(observable: Observable<T>, ms: number): Observable<T> {
  const debounced = createObservable<T>();
  let timeoutId: ReturnType<typeof setTimeout>;
  observable.subscribe((value) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => debounced.next(value), ms);
  });
  return debounced;
}

export function throttle<T>(observable: Observable<T>, ms: number): Observable<T> {
  const throttled = createObservable<T>();
  let lastTime = 0;
  observable.subscribe((value) => {
    const now = Date.now();
    if (now - lastTime >= ms) {
      throttled.next(value);
      lastTime = now;
    }
  });
  return throttled;
}

export function scan<T, U>(observable: Observable<T>, fn: (acc: U, value: T) => U, initial: U): Observable<U> {
  const scanned = createObservable<U>();
  let accumulator = initial;
  observable.subscribe((value) => {
    accumulator = fn(accumulator, value);
    scanned.next(accumulator);
  });
  return scanned;
}

export function reduce<T, U>(observable: Observable<T>, fn: (acc: U, value: T) => U, initial: U): Observable<U> {
  const reduced = createObservable<U>();
  let accumulator = initial;
  let count = 0;
  observable.subscribe((value) => {
    accumulator = fn(accumulator, value);
    count++;
  });
  return reduced;
}
