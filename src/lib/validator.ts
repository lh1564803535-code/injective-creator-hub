/**
 * Validator utilities
 */

type ValidationResult = { valid: boolean; errors: string[] };

function createValidator<T>(rules: Array<(value: T) => string | null>) {
  return (value: T): ValidationResult => {
    const errors: string[] = [];
    for (const rule of rules) {
      const error = rule(value);
      if (error) errors.push(error);
    }
    return { valid: errors.length === 0, errors };
  };
}

// String validators
export function required(value: unknown): string | null {
  if (value === undefined || value === null || value === "") {
    return "This field is required";
  }
  return null;
}

export function minLength(min: number) {
  return (value: string): string | null => {
    if (typeof value === "string" && value.length < min) {
      return `Must be at least ${min} characters`;
    }
    return null;
  };
}

export function maxLength(max: number) {
  return (value: string): string | null => {
    if (typeof value === "string" && value.length > max) {
      return `Must be at most ${max} characters`;
    }
    return null;
  };
}

export function pattern(regex: RegExp, message: string) {
  return (value: string): string | null => {
    if (typeof value === "string" && !regex.test(value)) {
      return message;
    }
    return null;
  };
}

export function email(value: string): string | null {
  return pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address")(value);
}

export function url(value: string): string | null {
  try {
    new URL(value);
    return null;
  } catch {
    return "Invalid URL";
  }
}

// Number validators
export function min(minValue: number) {
  return (value: number): string | null => {
    if (typeof value === "number" && value < minValue) {
      return `Must be at least ${minValue}`;
    }
    return null;
  };
}

export function max(maxValue: number) {
  return (value: number): string | null => {
    if (typeof value === "number" && value > maxValue) {
      return `Must be at most ${maxValue}`;
    }
    return null;
  };
}

export function integer(value: number): string | null {
  if (typeof value === "number" && !Number.isInteger(value)) {
    return "Must be an integer";
  }
  return null;
}

export function positive(value: number): string | null {
  if (typeof value === "number" && value <= 0) {
    return "Must be positive";
  }
  return null;
}

// Array validators
export function minItems(minCount: number) {
  return (value: unknown[]): string | null => {
    if (Array.isArray(value) && value.length < minCount) {
      return `Must have at least ${minCount} items`;
    }
    return null;
  };
}

export function maxItems(maxCount: number) {
  return (value: unknown[]): string | null => {
    if (Array.isArray(value) && value.length > maxCount) {
      return `Must have at most ${maxCount} items`;
    }
    return null;
  };
}

// Object validators
export function hasProperty(key: string) {
  return (value: Record<string, unknown>): string | null => {
    if (typeof value === "object" && value !== null && !(key in value)) {
      return `Must have property "${key}"`;
    }
    return null;
  };
}

// Ethereum validators
export function ethereumAddress(value: string): string | null {
  if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
    return "Invalid Ethereum address";
  }
  return null;
}

export function transactionHash(value: string): string | null {
  if (!/^0x[a-fA-F0-9]{64}$/.test(value)) {
    return "Invalid transaction hash";
  }
  return null;
}

// Composite validators
export function compose<T>(...validators: Array<(value: T) => string | null>) {
  return createValidator(validators);
}

export function optional<T>(validator: (value: T) => string | null) {
  return (value: T | undefined | null): string | null => {
    if (value === undefined || value === null) return null;
    return validator(value);
  };
}

// Validate object fields
export function validateFields<T extends Record<string, unknown>>(
  obj: T,
  rules: Partial<Record<keyof T, Array<(value: unknown) => string | null>>>
): ValidationResult {
  const errors: string[] = [];

  for (const [field, fieldRules] of Object.entries(rules)) {
    if (!fieldRules) continue;
    const value = obj[field];
    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) errors.push(`${field}: ${error}`);
    }
  }

  return { valid: errors.length === 0, errors };
}
