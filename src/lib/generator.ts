/**
 * Generator utilities
 */

export function createIdGenerator(prefix: string = ""): () => string {
  let counter = 0;
  return () => `${prefix}${++counter}`;
}

export function createTimestampGenerator(): () => number {
  return () => Date.now();
}

export function createRandomGenerator(min: number, max: number): () => number {
  return () => Math.random() * (max - min) + min;
}

export function createRandomIntGenerator(min: number, max: number): () => number {
  return () => Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createSequentialGenerator(start: number, step: number = 1): () => number {
  let current = start - step;
  return () => {
    current += step;
    return current;
  };
}

export function createCyclicGenerator<T>(items: T[]): () => T {
  let index = 0;
  return () => {
    const item = items[index % items.length];
    index++;
    return item;
  };
}

export function createWeightedRandomGenerator<T>(
  items: { item: T; weight: number }[]
): () => T {
  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);

  return () => {
    let random = Math.random() * totalWeight;
    for (const { item, weight } of items) {
      random -= weight;
      if (random <= 0) return item;
    }
    return items[items.length - 1].item;
  };
}

export function createExponentialBackoffGenerator(
  baseDelay: number,
  maxDelay: number,
  factor: number = 2
): () => number {
  let attempt = 0;
  return () => {
    const delay = Math.min(baseDelay * Math.pow(factor, attempt), maxDelay);
    attempt++;
    return delay;
  };
}

export function createUUIDGenerator(): () => string {
  return () => crypto.randomUUID();
}

export function createShortIdGenerator(length: number = 8): () => string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return () => {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
}

export function createCounterGenerator(
  start: number = 0,
  step: number = 1
): { next: () => number; reset: () => void; current: () => number } {
  let current = start - step;

  return {
    next: () => {
      current += step;
      return current;
    },
    reset: () => {
      current = start - step;
    },
    current: () => current,
  };
}

export function createBatchGenerator<T>(
  items: T[],
  batchSize: number
): () => T[] {
  let index = 0;
  return () => {
    const batch = items.slice(index, index + batchSize);
    index += batchSize;
    if (index >= items.length) index = 0;
    return batch;
  };
}
