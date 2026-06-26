/**
 * Iterator utilities
 */

export function* range(start: number, end: number, step: number = 1): Generator<number> {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

export function* count(start: number = 0, step: number = 1): Generator<number> {
  let current = start;
  while (true) {
    yield current;
    current += step;
  }
}

export function* take<T>(iterable: Iterable<T>, n: number): Generator<T> {
  let taken = 0;
  for (const item of iterable) {
    if (taken >= n) break;
    yield item;
    taken++;
  }
}

export function* skip<T>(iterable: Iterable<T>, n: number): Generator<T> {
  let skipped = 0;
  for (const item of iterable) {
    if (skipped < n) {
      skipped++;
      continue;
    }
    yield item;
  }
}

export function* filter<T>(iterable: Iterable<T>, predicate: (item: T) => boolean): Generator<T> {
  for (const item of iterable) {
    if (predicate(item)) {
      yield item;
    }
  }
}

export function* map<T, U>(iterable: Iterable<T>, fn: (item: T) => U): Generator<U> {
  for (const item of iterable) {
    yield fn(item);
  }
}

export function* flatMap<T, U>(iterable: Iterable<T>, fn: (item: T) => Iterable<U>): Generator<U> {
  for (const item of iterable) {
    yield* fn(item);
  }
}

export function* concat<T>(...iterables: Iterable<T>[]): Generator<T> {
  for (const iterable of iterables) {
    yield* iterable;
  }
}

export function* zip<T, U>(iterable1: Iterable<T>, iterable2: Iterable<U>): Generator<[T, U]> {
  const iter1 = iterable1[Symbol.iterator]();
  const iter2 = iterable2[Symbol.iterator]();

  while (true) {
    const result1 = iter1.next();
    const result2 = iter2.next();

    if (result1.done || result2.done) break;

    yield [result1.value, result2.value];
  }
}

export function* enumerate<T>(iterable: Iterable<T>): Generator<[number, T]> {
  let index = 0;
  for (const item of iterable) {
    yield [index, item];
    index++;
  }
}

export function* chunk<T>(iterable: Iterable<T>, size: number): Generator<T[]> {
  let chunk: T[] = [];

  for (const item of iterable) {
    chunk.push(item);
    if (chunk.length === size) {
      yield chunk;
      chunk = [];
    }
  }

  if (chunk.length > 0) {
    yield chunk;
  }
}

export function* unique<T>(iterable: Iterable<T>): Generator<T> {
  const seen = new Set<T>();
  for (const item of iterable) {
    if (!seen.has(item)) {
      seen.add(item);
      yield item;
    }
  }
}

export function* uniqueBy<T, K>(iterable: Iterable<T>, keyFn: (item: T) => K): Generator<T> {
  const seen = new Set<K>();
  for (const item of iterable) {
    const key = keyFn(item);
    if (!seen.has(key)) {
      seen.add(key);
      yield item;
    }
  }
}

export function toArray<T>(iterable: Iterable<T>): T[] {
  return Array.from(iterable);
}

export function first<T>(iterable: Iterable<T>): T | undefined {
  for (const item of iterable) {
    return item;
  }
  return undefined;
}

export function last<T>(iterable: Iterable<T>): T | undefined {
  let result: T | undefined;
  for (const item of iterable) {
    result = item;
  }
  return result;
}

export function countItems<T>(iterable: Iterable<T>): number {
  let count = 0;
  for (const _ of iterable) {
    count++;
  }
  return count;
}

export function isEmpty<T>(iterable: Iterable<T>): boolean {
  for (const _ of iterable) {
    return false;
  }
  return true;
}

export function some<T>(iterable: Iterable<T>, predicate: (item: T) => boolean): boolean {
  for (const item of iterable) {
    if (predicate(item)) return true;
  }
  return false;
}

export function every<T>(iterable: Iterable<T>, predicate: (item: T) => boolean): boolean {
  for (const item of iterable) {
    if (!predicate(item)) return false;
  }
  return true;
}

export function reduce<T, U>(iterable: Iterable<T>, fn: (acc: U, item: T) => U, initial: U): U {
  let acc = initial;
  for (const item of iterable) {
    acc = fn(acc, item);
  }
  return acc;
}
