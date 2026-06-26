/**
 * Optics utilities (Prism, Traversal, etc.)
 */

interface Prism<S, A> {
  get: (source: S) => A | undefined;
  set: (source: S, value: A) => S;
}

interface Traversal<S, A> {
  getAll: (source: S) => A[];
  modify: (source: S, fn: (value: A) => A) => S;
}

export function createPrism<S, A>(
  getter: (source: S) => A | undefined,
  setter: (source: S, value: A) => S
): Prism<S, A> {
  return { get: getter, set: setter };
}

export function prismProp<S, K extends keyof S>(key: K): Prism<S, S[K]> {
  return {
    get: (source) => source[key],
    set: (source, value) => ({ ...source, [key]: value }),
  };
}

export function prismOptional<S, A>(
  getter: (source: S) => A | undefined,
  setter: (source: S, value: A) => S
): Prism<S, A> {
  return { get: getter, set: setter };
}

export function composePrism<S, A, B>(
  outer: Prism<S, A>,
  inner: Prism<A, B>
): Prism<S, B> {
  return {
    get: (source) => {
      const a = outer.get(source);
      return a !== undefined ? inner.get(a) : undefined;
    },
    set: (source, value) => {
      const a = outer.get(source);
      if (a === undefined) return source;
      return outer.set(source, inner.set(a, value));
    },
  };
}

export function preview<S, A>(prism: Prism<S, A>, source: S): A | undefined {
  return prism.get(source);
}

export function setPrism<S, A>(prism: Prism<S, A>, value: A, source: S): S {
  return prism.set(source, value);
}

export function overPrism<S, A>(prism: Prism<S, A>, fn: (value: A) => A, source: S): S {
  const value = prism.get(source);
  if (value === undefined) return source;
  return prism.set(source, fn(value));
}

export function createTraversal<S, A>(
  getAll: (source: S) => A[],
  modify: (source: S, fn: (value: A) => A) => S
): Traversal<S, A> {
  return { getAll, modify };
}

export function traversalArray<A>(): Traversal<A[], A> {
  return {
    getAll: (source) => source,
    modify: (source, fn) => source.map(fn),
  };
}

export function traversalObject<V>(): Traversal<Record<string, V>, V> {
  return {
    getAll: (source) => Object.values(source),
    modify: (source, fn) => {
      const result: Record<string, V> = {};
      for (const [key, value] of Object.entries(source)) {
        result[key] = fn(value);
      }
      return result;
    },
  };
}

export function composeTraversal<S, A, B>(
  outer: Traversal<S, A>,
  inner: Traversal<A, B>
): Traversal<S, B> {
  return {
    getAll: (source) => outer.getAll(source).flatMap((a) => inner.getAll(a)),
    modify: (source, fn) => outer.modify(source, (a) => inner.modify(a, fn)),
  };
}

export function getAll<S, A>(traversal: Traversal<S, A>, source: S): A[] {
  return traversal.getAll(source);
}

export function modify<S, A>(traversal: Traversal<S, A>, fn: (value: A) => A, source: S): S {
  return traversal.modify(source, fn);
}

export function setTraversal<S, A>(traversal: Traversal<S, A>, value: A, source: S): S {
  return traversal.modify(source, () => value);
}

export function previewFirst<S, A>(traversal: Traversal<S, A>, source: S): A | undefined {
  const all = traversal.getAll(source);
  return all.length > 0 ? all[0] : undefined;
}

export function length<S, A>(traversal: Traversal<S, A>, source: S): number {
  return traversal.getAll(source).length;
}
