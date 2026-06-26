/**
 * Async Validator utilities
 */

type AsyncValidationResult = { valid: boolean; errors: string[] };
type AsyncValidatorFn<T> = (value: T) => Promise<string | null>;

class AsyncValidator<T> {
  private rules: AsyncValidatorFn<T>[] = [];

  addRule(rule: AsyncValidatorFn<T>): this {
    this.rules.push(rule);
    return this;
  }

  async validate(value: T): Promise<AsyncValidationResult> {
    const errors: string[] = [];

    for (const rule of this.rules) {
      const error = await rule(value);
      if (error) errors.push(error);
    }

    return { valid: errors.length === 0, errors };
  }

  getRuleCount(): number {
    return this.rules.length;
  }

  clear(): void {
    this.rules = [];
  }
}

export function createAsyncValidator<T>(): AsyncValidator<T> {
  return new AsyncValidator<T>();
}

// Common async validators
export function asyncRequired(value: unknown): Promise<string | null> {
  return Promise.resolve(
    value === undefined || value === null || value === ""
      ? "This field is required"
      : null
  );
}

export function asyncMinLength(min: number) {
  return async (value: string): Promise<string | null> => {
    if (typeof value === "string" && value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  };
}

export function asyncMaxLength(max: number) {
  return async (value: string): Promise<string | null> => {
    if (typeof value === "string" && value.length > max) {
      return `Must be at most ${max} characters`;
    }
    return null;
  };
}

export function asyncPattern(regex: RegExp, message: string) {
  return async (value: string): Promise<string | null> => {
    if (typeof value === "string" && !regex.test(value)) {
      return message;
    }
    return null;
  };
}

export function asyncEmail(value: string): Promise<string | null> {
  return asyncPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address")(value);
}

export function asyncUrl(value: string): Promise<string | null> {
  try {
    new URL(value);
    return Promise.resolve(null);
  } catch {
    return Promise.resolve("Invalid URL");
  }
}

export function asyncMin(minValue: number) {
  return async (value: number): Promise<string | null> => {
    if (typeof value === "number" && value < minValue) {
      return `Must be at least ${minValue}`;
    }
    return null;
  };
}

export function asyncMax(maxValue: number) {
  return async (value: number): Promise<string | null> => {
    if (typeof value === "number" && value > maxValue) {
      return `Must be at most ${maxValue}`;
    }
    return null;
  };
}

// Async unique check (e.g., check if username exists)
export function asyncUnique(checkFn: (value: string) => Promise<boolean>, message: string) {
  return async (value: string): Promise<string | null> => {
    const exists = await checkFn(value);
    return exists ? message : null;
  };
}

// Async compose
export function asyncCompose<T>(...validators: AsyncValidatorFn<T>[]): AsyncValidatorFn<T> {
  return async (value: T): Promise<string | null> => {
    for (const validator of validators) {
      const error = await validator(value);
      if (error) return error;
    }
    return null;
  };
}

// Validate object fields
export async function validateFieldsAsync<T extends Record<string, unknown>>(
  obj: T,
  rules: Partial<Record<keyof T, AsyncValidatorFn<unknown>[]>>
): Promise<AsyncValidationResult> {
  const errors: string[] = [];

  for (const [field, fieldRules] of Object.entries(rules)) {
    if (!fieldRules) continue;
    const value = obj[field];

    for (const rule of fieldRules) {
      const error = await rule(value);
      if (error) errors.push(`${field}: ${error}`);
    }
  }

  return { valid: errors.length === 0, errors };
}
