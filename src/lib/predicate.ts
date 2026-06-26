/**
 * Predicate utilities
 */

type Predicate<T> = (value: T) => boolean;

export function createPredicate<T>(fn: Predicate<T>): Predicate<T> {
  return fn;
}

export function and<T>(...predicates: Predicate<T>[]): Predicate<T> {
  return (value) => predicates.every((p) => p(value));
}

export function or<T>(...predicates: Predicate<T>[]): Predicate<T> {
  return (value) => predicates.some((p) => p(value));
}

export function not<T>(predicate: Predicate<T>): Predicate<T> {
  return (value) => !predicate(value);
}

export function xor<T>(pred1: Predicate<T>, pred2: Predicate<T>): Predicate<T> {
  return (value) => pred1(value) !== pred2(value);
}

export function always<T>(): Predicate<T> {
  return () => true;
}

export function never<T>(): Predicate<T> {
  return () => false;
}

export function isNull<T>(): Predicate<T | null> {
  return (value) => value === null;
}

export function isNotNull<T>(): Predicate<T | null> {
  return (value) => value !== null;
}

export function isUndefined<T>(): Predicate<T | undefined> {
  return (value) => value === undefined;
}

export function isDefined<T>(): Predicate<T | undefined> {
  return (value) => value !== undefined;
}

export function isTruthy<T>(): Predicate<T> {
  return (value) => !!value;
}

export function isFalsy<T>(): Predicate<T> {
  return (value) => !value;
}

export function isEmpty(): Predicate<string | unknown[] | object> {
  return (value) => {
    if (typeof value === "string") return value.length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object" && value !== null) return Object.keys(value).length === 0;
    return false;
  };
}

export function isNotEmpty(): Predicate<string | unknown[] | object> {
  return not(isEmpty());
}

export function isEqual<T>(expected: T): Predicate<T> {
  return (value) => value === expected;
}

export function isNotEqual<T>(expected: T): Predicate<T> {
  return (value) => value !== expected;
}

export function isGreaterThan<T>(threshold: T): Predicate<T> {
  return (value) => value > threshold;
}

export function isGreaterThanOrEqual<T>(threshold: T): Predicate<T> {
  return (value) => value >= threshold;
}

export function isLessThan<T>(threshold: T): Predicate<T> {
  return (value) => value < threshold;
}

export function isLessThanOrEqual<T>(threshold: T): Predicate<T> {
  return (value) => value <= threshold;
}

export function isInRange(min: number, max: number): Predicate<number> {
  return (value) => value >= min && value <= max;
}

export function isOneOf<T>(...values: T[]): Predicate<T> {
  return (value) => values.includes(value);
}

export function isNoneOf<T>(...values: T[]): Predicate<T> {
  return (value) => !values.includes(value);
}

export function matchesPattern(pattern: RegExp): Predicate<string> {
  return (value) => pattern.test(value);
}

export function startsWith(prefix: string): Predicate<string> {
  return (value) => value.startsWith(prefix);
}

export function endsWith(suffix: string): Predicate<string> {
  return (value) => value.endsWith(suffix);
}

export function includes<T>(item: T): Predicate<T[]> {
  return (value) => value.includes(item);
}

export function hasLength(length: number): Predicate<string | unknown[]> {
  return (value) => value.length === length;
}

export function minLength(min: number): Predicate<string | unknown[]> {
  return (value) => value.length >= min;
}

export function maxLength(max: number): Predicate<string | unknown[]> {
  return (value) => value.length <= length;
}

export function hasProperty<K extends string>(key: K): Predicate<Record<K, unknown>> {
  return (value) => key in value;
}

export function propertyEquals<K extends string, V>(key: K, expected: V): Predicate<Record<K, V>> {
  return (value) => value[key] === expected;
}
