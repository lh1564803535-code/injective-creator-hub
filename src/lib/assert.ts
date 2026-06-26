/**
 * Assert utilities
 */

export class AssertionError extends Error {
  constructor(message: string, public actual?: unknown, public expected?: unknown) {
    super(message);
    this.name = "AssertionError";
  }
}

export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new AssertionError(message || "Assertion failed");
  }
}

export function assertEqual(actual: unknown, expected: unknown, message?: string): void {
  if (actual !== expected) {
    throw new AssertionError(
      message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
      actual,
      expected
    );
  }
}

export function assertNotEqual(actual: unknown, expected: unknown, message?: string): void {
  if (actual === expected) {
    throw new AssertionError(
      message || `Expected values to be different, both are ${JSON.stringify(actual)}`,
      actual
    );
  }
}

export function assertDeepEqual(actual: unknown, expected: unknown, message?: string): void {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new AssertionError(
      message || `Expected ${expectedJson}, got ${actualJson}`,
      actual,
      expected
    );
  }
}

export function assertNull(value: unknown, message?: string): void {
  if (value !== null) {
    throw new AssertionError(message || `Expected null, got ${JSON.stringify(value)}`, value, null);
  }
}

export function assertNotNull(value: unknown, message?: string): asserts value is NonNullable<typeof value> {
  if (value === null || value === undefined) {
    throw new AssertionError(message || "Expected non-null value", value);
  }
}

export function assertUndefined(value: unknown, message?: string): void {
  if (value !== undefined) {
    throw new AssertionError(message || `Expected undefined, got ${JSON.stringify(value)}`, value, undefined);
  }
}

export function assertDefined<T>(value: T | null | undefined, message?: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new AssertionError(message || "Expected defined value", value);
  }
}

export function assertType<T>(
  value: unknown,
  check: (value: unknown) => value is T,
  typeName: string,
  message?: string
): asserts value is T {
  if (!check(value)) {
    throw new AssertionError(
      message || `Expected ${typeName}, got ${typeof value}`,
      value
    );
  }
}

export function assertThrows(fn: () => void, message?: string): void {
  try {
    fn();
    throw new AssertionError(message || "Expected function to throw");
  } catch (error) {
    if (error instanceof AssertionError) throw error;
  }
}

export function assertDoesNotThrow(fn: () => void, message?: string): void {
  try {
    fn();
  } catch (error) {
    throw new AssertionError(
      message || `Expected function not to throw, but it threw: ${error}`,
      error
    );
  }
}

export async function assertRejects(fn: () => Promise<unknown>, message?: string): Promise<void> {
  try {
    await fn();
    throw new AssertionError(message || "Expected promise to reject");
  } catch (error) {
    if (error instanceof AssertionError) throw error;
  }
}

export async function assertResolves(fn: () => Promise<unknown>, message?: string): Promise<void> {
  try {
    await fn();
  } catch (error) {
    throw new AssertionError(
      message || `Expected promise to resolve, but it rejected: ${error}`,
      error
    );
  }
}
