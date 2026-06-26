/**
 * Serializer utilities
 */

export function serialize<T>(value: T): string {
  return JSON.stringify(value, (_key, val) => {
    if (typeof val === "bigint") {
      return { __type: "bigint", value: val.toString() };
    }
    if (val instanceof Date) {
      return { __type: "date", value: val.toISOString() };
    }
    if (val instanceof Map) {
      return { __type: "map", value: Array.from(val.entries()) };
    }
    if (val instanceof Set) {
      return { __type: "set", value: Array.from(val) };
    }
    return val;
  });
}

export function deserialize<T>(json: string): T {
  return JSON.parse(json, (_key, val) => {
    if (val && typeof val === "object" && val.__type) {
      switch (val.__type) {
        case "bigint":
          return BigInt(val.value);
        case "date":
          return new Date(val.value);
        case "map":
          return new Map(val.value);
        case "set":
          return new Set(val.value);
      }
    }
    return val;
  });
}

export function serializeToBase64(value: unknown): string {
  const json = serialize(value);
  return btoa(json);
}

export function deserializeFromBase64<T>(base64: string): T {
  const json = atob(base64);
  return deserialize<T>(json);
}

export function serializeToUrl(value: unknown): string {
  const json = serialize(value);
  return encodeURIComponent(json);
}

export function deserializeFromUrl<T>(encoded: string): T {
  const json = decodeURIComponent(encoded);
  return deserialize<T>(json);
}

// Compact serialization (no whitespace)
export function serializeCompact<T>(value: T): string {
  return JSON.stringify(value);
}

// Pretty serialization (with indentation)
export function serializePretty<T>(value: T, indent: number = 2): string {
  return JSON.stringify(value, null, indent);
}

// Partial serialization (pick specific keys)
export function serializePartial<T extends Record<string, unknown>>(
  value: T,
  keys: (keyof T)[]
): string {
  const partial: Record<string, unknown> = {};
  for (const key of keys) {
    partial[key as string] = value[key];
  }
  return JSON.stringify(partial);
}

// Deserialize with defaults
export function deserializeWithDefaults<T>(json: string, defaults: Partial<T>): T {
  const parsed = JSON.parse(json);
  return { ...defaults, ...parsed };
}

// Safe deserialize (returns null on error)
export function safeDeserialize<T>(json: string): T | null {
  try {
    return deserialize<T>(json);
  } catch {
    return null;
  }
}

// Serialize for storage (localStorage, etc.)
export function serializeForStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, serialize(value));
  } catch (error) {
    console.error("Failed to serialize for storage:", error);
  }
}

export function deserializeFromStorage<T>(key: string, defaults: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaults;
    return deserialize<T>(item);
  } catch {
    return defaults;
  }
}
