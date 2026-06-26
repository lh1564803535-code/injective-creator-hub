/**
 * Object utilities
 */

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target };

  Object.keys(source).forEach((key) => {
    const sourceValue = source[key as keyof T];
    const targetValue = target[key as keyof T];

    if (
      sourceValue &&
      typeof sourceValue === "object" &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === "object" &&
      !Array.isArray(targetValue)
    ) {
      result[key as keyof T] = deepMerge(
        targetValue as object,
        sourceValue as object
      ) as T[keyof T];
    } else if (sourceValue !== undefined) {
      result[key as keyof T] = sourceValue as T[keyof T];
    }
  });

  return result;
}

export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

export function mapValues<T, U>(
  obj: Record<string, T>,
  fn: (value: T, key: string) => U
): Record<string, U> {
  const result: Record<string, U> = {};
  Object.entries(obj).forEach(([key, value]) => {
    result[key] = fn(value, key);
  });
  return result;
}

export function filterObject<T>(
  obj: Record<string, T>,
  fn: (value: T, key: string) => boolean
): Record<string, T> {
  const result: Record<string, T> = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (fn(value, key)) {
      result[key] = value;
    }
  });
  return result;
}

export function mapKeys<T>(
  obj: Record<string, T>,
  fn: (key: string) => string
): Record<string, T> {
  const result: Record<string, T> = {};
  Object.entries(obj).forEach(([key, value]) => {
    result[fn(key)] = value;
  });
  return result;
}

export function invert<T extends string | number>(
  obj: Record<string, T>
): Record<string, string> {
  const result: Record<string, string> = {};
  Object.entries(obj).forEach(([key, value]) => {
    result[String(value)] = key;
  });
  return result;
}
