/**
 * Monad utilities (Maybe, Either, Result)
 */

// Maybe monad
export class Maybe<T> {
  private constructor(private value: T | null | undefined) {}

  static of<T>(value: T | null | undefined): Maybe<T> {
    return new Maybe(value);
  }

  static none<T>(): Maybe<T> {
    return new Maybe(null);
  }

  static some<T>(value: T): Maybe<T> {
    return new Maybe(value);
  }

  isNone(): boolean {
    return this.value === null || this.value === undefined;
  }

  isSome(): boolean {
    return !this.isNone();
  }

  map<U>(fn: (value: T) => U): Maybe<U> {
    if (this.isNone()) return Maybe.none();
    return Maybe.of(fn(this.value as T));
  }

  flatMap<U>(fn: (value: T) => Maybe<U>): Maybe<U> {
    if (this.isNone()) return Maybe.none();
    return fn(this.value as T);
  }

  filter(predicate: (value: T) => boolean): Maybe<T> {
    if (this.isNone() || !predicate(this.value as T)) return Maybe.none();
    return this;
  }

  getOrElse(defaultValue: T): T {
    return this.isNone() ? defaultValue : (this.value as T);
  }

  getOrThrow(error: Error): T {
    if (this.isNone()) throw error;
    return this.value as T;
  }

  toArray(): T[] {
    return this.isNone() ? [] : [this.value as T];
  }

  toPromise(): Promise<T> {
    return this.isNone()
      ? Promise.reject(new Error("None"))
      : Promise.resolve(this.value as T);
  }
}

// Either monad
export class Either<L, R> {
  private constructor(
    private leftValue: L | undefined,
    private rightValue: R | undefined,
    private isLeft: boolean
  ) {}

  static left<L, R>(value: L): Either<L, R> {
    return new Either(value, undefined, true);
  }

  static right<L, R>(value: R): Either<L, R> {
    return new Either(undefined, value, false);
  }

  isLeft(): boolean {
    return this.isLeft;
  }

  isRight(): boolean {
    return !this.isLeft;
  }

  map<U>(fn: (value: R) => U): Either<L, U> {
    if (this.isLeft()) return Either.left(this.leftValue as L);
    return Either.right(fn(this.rightValue as R));
  }

  mapLeft<U>(fn: (value: L) => U): Either<U, R> {
    if (this.isLeft()) return Either.left(fn(this.leftValue as L));
    return Either.right(this.rightValue as R);
  }

  flatMap<U>(fn: (value: R) => Either<L, U>): Either<L, U> {
    if (this.isLeft()) return Either.left(this.leftValue as L);
    return fn(this.rightValue as R);
  }

  fold<U>(leftFn: (left: L) => U, rightFn: (right: R) => U): U {
    return this.isLeft()
      ? leftFn(this.leftValue as L)
      : rightFn(this.rightValue as R);
  }

  getOrElse(defaultValue: R): R {
    return this.isLeft() ? defaultValue : (this.rightValue as R);
  }

  getLeftOrElse(defaultValue: L): L {
    return this.isLeft() ? (this.leftValue as L) : defaultValue;
  }

  swap(): Either<R, L> {
    return this.isLeft()
      ? Either.right(this.leftValue as L)
      : Either.left(this.rightValue as R);
  }

  toPromise(): Promise<R> {
    return this.isLeft()
      ? Promise.reject(this.leftValue)
      : Promise.resolve(this.rightValue as R);
  }
}

// Result monad (similar to Either but for errors)
export class Result<T, E = Error> {
  private constructor(
    private value: T | undefined,
    private error: E | undefined,
    private isOk: boolean
  ) {}

  static ok<T, E = Error>(value: T): Result<T, E> {
    return new Result(value, undefined, true);
  }

  static err<T, E = Error>(error: E): Result<T, E> {
    return new Result(undefined, error, false);
  }

  static from<T, E = Error>(fn: () => T): Result<T, E> {
    try {
      return Result.ok(fn());
    } catch (error) {
      return Result.err(error as E);
    }
  }

  static async fromPromise<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
    try {
      const value = await promise;
      return Result.ok(value);
    } catch (error) {
      return Result.err(error as E);
    }
  }

  isOk(): boolean {
    return this.isOk;
  }

  isErr(): boolean {
    return !this.isOk;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this.isErr()) return Result.err(this.error as E);
    return Result.ok(fn(this.value as T));
  }

  mapError<F>(fn: (error: E) => F): Result<T, F> {
    if (this.isOk()) return Result.ok(this.value as T);
    return Result.err(fn(this.error as E));
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    if (this.isErr()) return Result.err(this.error as E);
    return fn(this.value as T);
  }

  fold<U>(okFn: (value: T) => U, errFn: (error: E) => U): U {
    return this.isOk()
      ? okFn(this.value as T)
      : errFn(this.error as E);
  }

  getOrElse(defaultValue: T): T {
    return this.isOk() ? (this.value as T) : defaultValue;
  }

  getError(): E | undefined {
    return this.error;
  }

  toPromise(): Promise<T> {
    return this.isOk()
      ? Promise.resolve(this.value as T)
      : Promise.reject(this.error);
  }

  toEither(): Either<E, T> {
    return this.isOk()
      ? Either.right(this.value as T)
      : Either.left(this.error as E);
  }
}

// Helper functions
export function tryCatch<T>(fn: () => T): Result<T> {
  return Result.from(fn);
}

export function tryCatchAsync<T>(fn: () => Promise<T>): Promise<Result<T>> {
  return Result.fromPromise(fn());
}
