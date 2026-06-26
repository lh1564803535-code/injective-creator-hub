/**
 * Functional programming utilities
 */

// Curry
export function curry<T extends unknown[], R>(
  fn: (...args: T) => R
): (...args: Partial<T>) => unknown {
  return function curried(...args: Partial<T>) {
    if (args.length >= fn.length) {
      return fn(...(args as T));
    }
    return (...nextArgs: Partial<T>) => curried(...args, ...nextArgs);
  };
}

// Uncurry
export function uncurry<T extends unknown[], R>(
  fn: (...args: unknown[]) => unknown
): (...args: T) => R {
  return (...args: T) => fn(...args) as R;
}

// Partial application
export function partial<T extends unknown[], R>(
  fn: (...args: T) => R,
  ...partialArgs: Partial<T>
): (...remainingArgs: unknown[]) => R {
  return (...remainingArgs: unknown[]) => fn(...(partialArgs.concat(remainingArgs) as T));
}

// Compose
export function compose<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);
}

// Pipe
export function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg);
}

// Identity
export function identity<T>(value: T): T {
  return value;
}

// Constant
export function constant<T>(value: T): () => T {
  return () => value;
}

// Flip
export function flip<T, U, R>(fn: (a: T, b: U) => R): (b: U, a: T) => R {
  return (b, a) => fn(a, b);
}

// Negate
export function negate(fn: (...args: unknown[]) => boolean): (...args: unknown[]) => boolean {
  return (...args) => !fn(...args);
}

// Memoize
export function memoize<T extends unknown[], R>(
  fn: (...args: T) => R,
  keyFn?: (...args: T) => string
): (...args: T) => R {
  const cache = new Map<string, R>();
  return (...args: T) => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Debounce
export function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number
): (...args: T) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Throttle
export function throttle<T extends unknown[]>(
  fn: (...args: T) => void,
  limit: number
): (...args: T) => void {
  let inThrottle: boolean;
  return (...args: T) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Once
export function once<T extends unknown[], R>(fn: (...args: T) => R): (...args: T) => R {
  let called = false;
  let result: R;
  return (...args: T) => {
    if (!called) {
      result = fn(...args);
      called = true;
    }
    return result;
  };
}

// Guard
export function guard<T>(
  predicate: (value: T) => boolean,
  fn: (value: T) => T
): (value: T) => T {
  return (value: T) => (predicate(value) ? fn(value) : value);
}

// When
export function when<T>(
  predicate: (value: T) => boolean,
  fn: (value: T) => T
): (value: T) => T {
  return guard(predicate, fn);
}

// Unless
export function unless<T>(
  predicate: (value: T) => boolean,
  fn: (value: T) => T
): (value: T) => T {
  return guard((value) => !predicate(value), fn);
}

// Tap
export function tap<T>(fn: (value: T) => void): (value: T) => T {
  return (value: T) => {
    fn(value);
    return value;
  };
}

// Converge
export function converge<T, R>(
  after: (...args: unknown[]) => R,
  fns: Array<(value: T) => unknown>
): (value: T) => R {
  return (value: T) => after(...fns.map((fn) => fn(value)));
}

// Juxt
export function juxt<T, R>(fns: Array<(value: T) => R>): (value: T) => R[] {
  return (value: T) => fns.map((fn) => fn(value));
}
