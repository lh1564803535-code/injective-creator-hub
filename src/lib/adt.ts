/**
 * Algebraic Data Types utilities
 */

// Tagged Union
export type TaggedUnion<T extends Record<string, unknown>> = {
  [K in keyof T]: { tag: K; value: T[K] };
}[keyof T];

export function match<T extends Record<string, unknown>, R>(
  union: TaggedUnion<T>,
  cases: { [K in keyof T]: (value: T[K]) => R }
): R {
  return cases[union.tag](union.value as T[typeof union.tag]);
}

// Option type
export type Option<T> = { tag: "some"; value: T } | { tag: "none" };

export function some<T>(value: T): Option<T> {
  return { tag: "some", value };
}

export function none<T>(): Option<T> {
  return { tag: "none" } as Option<T>;
}

export function isSome<T>(option: Option<T>): option is { tag: "some"; value: T } {
  return option.tag === "some";
}

export function isNone<T>(option: Option<T>): option is { tag: "none" } {
  return option.tag === "none";
}

export function mapOption<T, U>(option: Option<T>, fn: (value: T) => U): Option<U> {
  return isSome(option) ? some(fn(option.value)) : none();
}

export function flatMapOption<T, U>(option: Option<T>, fn: (value: T) => Option<U>): Option<U> {
  return isSome(option) ? fn(option.value) : none();
}

export function getOrElseOption<T>(option: Option<T>, defaultValue: T): T {
  return isSome(option) ? option.value : defaultValue;
}

// Result type
export type Result<T, E> = { tag: "ok"; value: T } | { tag: "error"; error: E };

export function ok<T, E>(value: T): Result<T, E> {
  return { tag: "ok", value };
}

export function err<T, E>(error: E): Result<T, E> {
  return { tag: "error", error };
}

export function isOk<T, E>(result: Result<T, E>): result is { tag: "ok"; value: T } {
  return result.tag === "ok";
}

export function isErr<T, E>(result: Result<T, E>): result is { tag: "error"; error: E } {
  return result.tag === "error";
}

export function mapResult<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  return isOk(result) ? ok(fn(result.value)) : result;
}

export function mapErrorResult<T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> {
  return isErr(result) ? err(fn(result.error)) : result;
}

export function flatMapResult<T, U, E>(result: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E> {
  return isOk(result) ? fn(result.value) : result;
}

export function getOrElseResult<T, E>(result: Result<T, E>, defaultValue: T): T {
  return isOk(result) ? result.value : defaultValue;
}

export function foldResult<T, E, R>(result: Result<T, E>, okFn: (value: T) => R, errFn: (error: E) => R): R {
  return isOk(result) ? okFn(result.value) : errFn(result.error);
}

// Async utilities
export async function mapAsync<T, U>(promise: Promise<T>, fn: (value: T) => U): Promise<U> {
  const value = await promise;
  return fn(value);
}

export async function flatMapAsync<T, U>(promise: Promise<T>, fn: (value: T) => Promise<U>): Promise<U> {
  const value = await promise;
  return fn(value);
}

export async function mapErrorAsync<T, E>(promise: Promise<T>, fn: (error: unknown) => E): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    throw fn(error);
  }
}

export async function tryCatchAsync<T>(fn: () => Promise<T>): Promise<Result<T, Error>> {
  try {
    const value = await fn();
    return ok(value);
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)));
  }
}

export function tryCatch<T>(fn: () => T): Result<T, Error> {
  try {
    return ok(fn());
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)));
  }
}
