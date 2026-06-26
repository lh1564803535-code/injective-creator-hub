/**
 * Stream utilities
 */

class Stream<T> {
  constructor(private iterable: AsyncIterable<T>) {}

  static from<T>(iterable: AsyncIterable<T>): Stream<T> {
    return new Stream(iterable);
  }

  static fromArray<T>(array: T[]): Stream<T> {
    return new Stream((async function* () {
      for (const item of array) {
        yield item;
      }
    })());
  }

  static fromPromise<T>(promise: Promise<T>): Stream<T> {
    return new Stream((async function* () {
      yield await promise;
    })());
  }

  static fromInterval(ms: number): Stream<number> {
    return new Stream((async function* () {
      let count = 0;
      while (true) {
        yield count++;
        await new Promise((resolve) => setTimeout(resolve, ms));
      }
    })());
  }

  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    yield* this.iterable;
  }

  async map<U>(fn: (value: T) => U | Promise<U>): Promise<Stream<U>> {
    const source = this.iterable;
    return new Stream((async function* () {
      for await (const value of source) {
        yield await fn(value);
      }
    })());
  }

  async filter(predicate: (value: T) => boolean | Promise<boolean>): Promise<Stream<T>> {
    const source = this.iterable;
    return new Stream((async function* () {
      for await (const value of source) {
        if (await predicate(value)) {
          yield value;
        }
      }
    })());
  }

  async take(count: number): Promise<Stream<T>> {
    const source = this.iterable;
    return new Stream((async function* () {
      let taken = 0;
      for await (const value of source) {
        if (taken >= count) break;
        yield value;
        taken++;
      }
    })());
  }

  async skip(count: number): Promise<Stream<T>> {
    const source = this.iterable;
    return new Stream((async function* () {
      let skipped = 0;
      for await (const value of source) {
        if (skipped < count) {
          skipped++;
          continue;
        }
        yield value;
      }
    })());
  }

  async forEach(fn: (value: T) => void | Promise<void>): Promise<void> {
    for await (const value of this.iterable) {
      await fn(value);
    }
  }

  async toArray(): Promise<T[]> {
    const result: T[] = [];
    for await (const value of this.iterable) {
      result.push(value);
    }
    return result;
  }

  async reduce<U>(fn: (acc: U, value: T) => U | Promise<U>, initial: U): Promise<U> {
    let accumulator = initial;
    for await (const value of this.iterable) {
      accumulator = await fn(accumulator, value);
    }
    return accumulator;
  }

  async find(predicate: (value: T) => boolean | Promise<boolean>): Promise<T | undefined> {
    for await (const value of this.iterable) {
      if (await predicate(value)) {
        return value;
      }
    }
    return undefined;
  }

  async some(predicate: (value: T) => boolean | Promise<boolean>): Promise<boolean> {
    for await (const value of this.iterable) {
      if (await predicate(value)) {
        return true;
      }
    }
    return false;
  }

  async every(predicate: (value: T) => boolean | Promise<boolean>): Promise<boolean> {
    for await (const value of this.iterable) {
      if (!(await predicate(value))) {
        return false;
      }
    }
    return true;
  }

  async count(): Promise<number> {
    let count = 0;
    for await (const _ of this.iterable) {
      count++;
    }
    return count;
  }

  async first(): Promise<T | undefined> {
    for await (const value of this.iterable) {
      return value;
    }
    return undefined;
  }

  async last(): Promise<T | undefined> {
    let last: T | undefined;
    for await (const value of this.iterable) {
      last = value;
    }
    return last;
  }
}

export function createStream<T>(iterable: AsyncIterable<T>): Stream<T> {
  return Stream.from(iterable);
}

export function streamFromArray<T>(array: T[]): Stream<T> {
  return Stream.fromArray(array);
}

export function streamFromPromise<T>(promise: Promise<T>): Stream<T> {
  return Stream.fromPromise(promise);
}

export function streamFromInterval(ms: number): Stream<number> {
  return Stream.fromInterval(ms);
}
