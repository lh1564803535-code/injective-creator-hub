/**
 * Lens utilities for immutable data access
 */

interface Lens<T, V> {
  get: (target: T) => V;
  set: (target: T, value: V) => T;
}

export function createLens<T, V>(
  getter: (target: T) => V,
  setter: (target: T, value: V) => T
): Lens<T, V> {
  return { get: getter, set: setter };
}

export function lensProp<T, K extends keyof T>(key: K): Lens<T, T[K]> {
  return {
    get: (target) => target[key],
    set: (target, value) => ({ ...target, [key]: value }),
  };
}

export function lensPath<T>(path: string[]): Lens<T, unknown> {
  return {
    get: (target) => {
      let current: unknown = target;
      for (const key of path) {
        if (current == null || typeof current !== "object") return undefined;
        current = (current as Record<string, unknown>)[key];
      }
      return current;
    },
    set: (target, value) => {
      if (path.length === 0) return value as T;
      const result = { ...target } as Record<string, unknown>;
      let current: Record<string, unknown> = result;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        const next = current[key];
        if (next == null || typeof next !== "object") {
          current[key] = {};
        } else {
          current[key] = { ...next };
        }
        current = current[key] as Record<string, unknown>;
      }
      current[path[path.length - 1]] = value;
      return result as T;
    },
  };
}

export function lensIndex<T>(index: number): Lens<T[], T | undefined> {
  return {
    get: (target) => target[index],
    set: (target, value) => {
      const result = [...target];
      if (value !== undefined) {
        result[index] = value;
      }
      return result;
    },
  };
}

export function composeLenses<T, U, V>(
  outer: Lens<T, U>,
  inner: Lens<U, V>
): Lens<T, V> {
  return {
    get: (target) => inner.get(outer.get(target)),
    set: (target, value) => outer.set(target, inner.set(outer.get(target), value)),
  };
}

export function view<T, V>(lens: Lens<T, V>, target: T): V {
  return lens.get(target);
}

export function set<T, V>(lens: Lens<T, V>, value: V, target: T): T {
  return lens.set(target, value);
}

export function over<T, V>(lens: Lens<T, V>, fn: (value: V) => V, target: T): T {
  return lens.set(target, fn(lens.get(target)));
}

export function compose<T, U, V>(...lenses: Lens<T, U>[]): Lens<T, unknown> {
  return lenses.reduce((acc, lens) => composeLenses(acc, lens));
}

// Common lenses
export function idLens<T>(): Lens<T, T> {
  return {
    get: (target) => target,
    set: (_, value) => value,
  };
}

export function propLens<T, K extends keyof T>(key: K): Lens<T, T[K]> {
  return lensProp(key);
}

export function indexLens<T>(index: number): Lens<T[], T | undefined> {
  return lensIndex(index);
}

export function pathLens<T>(...path: string[]): Lens<T, unknown> {
  return lensPath(path);
}
