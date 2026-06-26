/**
 * State management utilities
 */

type Listener<T> = (state: T, prevState: T) => void;

class Store<T> {
  private state: T;
  private listeners: Set<Listener<T>> = new Set();

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  setState(updater: T | ((prev: T) => T)): void {
    const prevState = this.state;
    this.state = typeof updater === "function"
      ? (updater as (prev: T) => T)(prevState)
      : updater;

    this.listeners.forEach((listener) => listener(this.state, prevState));
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getListenerCount(): number {
    return this.listeners.size;
  }
}

export function createStore<T>(initialState: T) {
  return new Store(initialState);
}

export function createPersistedStore<T>(
  key: string,
  initialState: T,
  serializer: (state: T) => string = JSON.stringify,
  deserializer: (str: string) => T = JSON.parse
): Store<T> {
  let persistedState = initialState;

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        persistedState = deserializer(stored);
      }
    } catch {
      // Ignore errors
    }
  }

  const store = new Store(persistedState);

  store.subscribe((state) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(key, serializer(state));
      } catch {
        // Ignore errors
      }
    }
  });

  return store;
}

export function combineSelectors<T, S>(
  store: Store<T>,
  selectors: ((state: T) => S)[]
): S[] {
  const state = store.getState();
  return selectors.map((selector) => selector(state));
}

export function createSelector<T, S>(
  selector: (state: T) => S,
  equalityFn: (a: S, b: S) => boolean = (a, b) => a === b
): (store: Store<T>) => S {
  let lastState: T;
  let lastResult: S;

  return (store: Store<T>): S => {
    const currentState = store.getState();
    if (currentState === lastState) return lastResult;

    const result = selector(currentState);
    if (!equalityFn(result, lastResult)) {
      lastResult = result;
    }
    lastState = currentState;
    return lastResult;
  };
}
