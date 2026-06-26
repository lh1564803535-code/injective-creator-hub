/**
 * Collection utilities
 */

export class Collection<T> {
  private items: T[] = [];

  constructor(items: T[] = []) {
    this.items = [...items];
  }

  add(item: T): Collection<T> {
    return new Collection([...this.items, item]);
  }

  remove(predicate: (item: T) => boolean): Collection<T> {
    return new Collection(this.items.filter((item) => !predicate(item)));
  }

  update(predicate: (item: T) => boolean, updater: (item: T) => T): Collection<T> {
    return new Collection(
      this.items.map((item) => (predicate(item) ? updater(item) : item))
    );
  }

  find(predicate: (item: T) => boolean): T | undefined {
    return this.items.find(predicate);
  }

  filter(predicate: (item: T) => boolean): Collection<T> {
    return new Collection(this.items.filter(predicate));
  }

  map<U>(fn: (item: T) => U): Collection<U> {
    return new Collection(this.items.map(fn));
  }

  reduce<U>(fn: (acc: U, item: T) => U, initial: U): U {
    return this.items.reduce(fn, initial);
  }

  sort(compareFn: (a: T, b: T) => number): Collection<T> {
    return new Collection([...this.items].sort(compareFn));
  }

  groupBy<K extends keyof T>(key: K): Map<T[K], T[]> {
    const groups = new Map<T[K], T[]>();
    this.items.forEach((item) => {
      const group = item[key];
      if (!groups.has(group)) {
        groups.set(group, []);
      }
      groups.get(group)!.push(item);
    });
    return groups;
  }

  unique(): Collection<T> {
    return new Collection([...new Set(this.items)]);
  }

  uniqueBy<K extends keyof T>(key: K): Collection<T> {
    const seen = new Set();
    return new Collection(
      this.items.filter((item) => {
        const value = item[key];
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
      })
    );
  }

  take(n: number): Collection<T> {
    return new Collection(this.items.slice(0, n));
  }

  skip(n: number): Collection<T> {
    return new Collection(this.items.slice(n));
  }

  first(): T | undefined {
    return this.items[0];
  }

  last(): T | undefined {
    return this.items[this.items.length - 1];
  }

  count(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  includes(item: T): boolean {
    return this.items.includes(item);
  }

  some(predicate: (item: T) => boolean): boolean {
    return this.items.some(predicate);
  }

  every(predicate: (item: T) => boolean): boolean {
    return this.items.every(predicate);
  }

  toArray(): T[] {
    return [...this.items];
  }

  forEach(fn: (item: T, index: number) => void): void {
    this.items.forEach(fn);
  }
}

export function collection<T>(items: T[] = []): Collection<T> {
  return new Collection(items);
}
