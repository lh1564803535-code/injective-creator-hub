/**
 * Decorator pattern utilities
 */

type AnyFunction = (...args: unknown[]) => unknown;

export function memoize<T extends AnyFunction>(
  fn: T,
  keyFn?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result as ReturnType<T>);
    return result;
  }) as T;
}

export function debounce<T extends AnyFunction>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends AnyFunction>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function once<T extends AnyFunction>(fn: T): T {
  let called = false;
  let result: ReturnType<T>;

  return ((...args: Parameters<T>) => {
    if (!called) {
      result = fn(...args) as ReturnType<T>;
      called = true;
    }
    return result;
  }) as T;
}

export function log<T extends AnyFunction>(
  fn: T,
  logger: (...args: unknown[]) => void = console.log
): T {
  return ((...args: Parameters<T>) => {
    logger(`Calling ${fn.name} with`, ...args);
    const result = fn(...args);
    logger(`${fn.name} returned`, result);
    return result;
  }) as T;
}

export function retry<T extends AnyFunction>(
  fn: T,
  maxRetries: number = 3,
  delay: number = 1000
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return fn(...args) as ReturnType<T>;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  };
}

export function validate<T extends AnyFunction>(
  fn: T,
  validator: (...args: Parameters<T>) => boolean | string
): T {
  return ((...args: Parameters<T>) => {
    const result = validator(...args);
    if (result === false) {
      throw new Error(`Validation failed for ${fn.name}`);
    }
    if (typeof result === "string") {
      throw new Error(result);
    }
    return fn(...args);
  }) as T;
}

export function cache<T extends AnyFunction>(
  fn: T,
  ttl: number = 60000
): T {
  const cacheMap = new Map<string, { value: ReturnType<T>; expiry: number }>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    const now = Date.now();
    const cached = cacheMap.get(key);

    if (cached && cached.expiry > now) {
      return cached.value;
    }

    const result = fn(...args);
    cacheMap.set(key, { value: result as ReturnType<T>, expiry: now + ttl });
    return result;
  }) as T;
}

export function compose<T extends AnyFunction>(...fns: T[]): T {
  return ((...args: Parameters<T>) => {
    return fns.reduce((result, fn) => fn(result), args[0]);
  }) as T;
}

export function pipe<T>(...fns: ((arg: T) => T)[]): (arg: T) => T {
  return (arg: T) => fns.reduce((result, fn) => fn(result), arg);
}
