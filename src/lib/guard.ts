/**
 * Guard utilities
 */

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

export function isNullish(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function isEmpty(value: unknown): boolean {
  if (isNullish(value)) return true;
  if (isString(value)) return value.length === 0;
  if (isArray(value)) return value.length === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  return false;
}

export function isNotEmpty(value: unknown): boolean {
  return !isEmpty(value);
}

export function isFunction(value: unknown): value is Function {
  return typeof value === "function";
}

export function isPromise(value: unknown): value is Promise<unknown> {
  return value instanceof Promise || (isObject(value) && isFunction((value as Record<string, unknown>).then));
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

export function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp;
}

export function isMap(value: unknown): value is Map<unknown, unknown> {
  return value instanceof Map;
}

export function isSet(value: unknown): value is Set<unknown> {
  return value instanceof Set;
}

export function isWeakMap(value: unknown): value is WeakMap<object, unknown> {
  return value instanceof WeakMap;
}

export function isWeakSet(value: unknown): value is WeakSet<object> {
  return value instanceof WeakSet;
}

export function isSymbol(value: unknown): value is symbol {
  return typeof value === "symbol";
}

export function isBigInt(value: unknown): value is bigint {
  return typeof value === "bigint";
}

// Blockchain guards
export function isAddress(value: unknown): value is string {
  return isString(value) && /^0x[a-fA-F0-9]{40}$/.test(value);
}

export function isTxHash(value: unknown): value is string {
  return isString(value) && /^0x[a-fA-F0-9]{64}$/.test(value);
}

export function isChainId(value: unknown): value is number {
  return isNumber(value) && Number.isInteger(value) && value > 0;
}

// Assertion
export function assert(value: unknown, message?: string): asserts value {
  if (!value) {
    throw new Error(message || "Assertion failed");
  }
}

export function assertIsString(value: unknown, message?: string): asserts value is string {
  if (!isString(value)) {
    throw new Error(message || `Expected string, got ${typeof value}`);
  }
}

export function assertIsNumber(value: unknown, message?: string): asserts value is number {
  if (!isNumber(value)) {
    throw new Error(message || `Expected number, got ${typeof value}`);
  }
}

export function assertIsArray(value: unknown, message?: string): asserts value is unknown[] {
  if (!isArray(value)) {
    throw new Error(message || `Expected array, got ${typeof value}`);
  }
}

export function assertIsObject(value: unknown, message?: string): asserts value is Record<string, unknown> {
  if (!isObject(value)) {
    throw new Error(message || `Expected object, got ${typeof value}`);
  }
}
