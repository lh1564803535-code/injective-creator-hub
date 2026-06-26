/**
 * Parse utilities
 */

export function parseNumber(value: unknown): number | null {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const num = parseFloat(value.replace(/,/g, ""));
    return isNaN(num) ? null : num;
  }
  return null;
}

export function parseInt(value: unknown): number | null {
  const num = parseNumber(value);
  return num !== null ? Math.floor(num) : null;
}

export function parseBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    if (["true", "1", "yes"].includes(lower)) return true;
    if (["false", "0", "no"].includes(lower)) return false;
  }
  return null;
}

export function parseDate(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
}

export function parseTimestamp(value: unknown): number | null {
  const date = parseDate(value);
  return date ? date.getTime() : null;
}

export function parseBigInt(value: unknown): bigint | null {
  try {
    if (typeof value === "bigint") return value;
    if (typeof value === "string") return BigInt(value);
    if (typeof value === "number") return BigInt(Math.floor(value));
    return null;
  } catch {
    return null;
  }
}

export function parseAddress(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (/^0x[a-fA-F0-9]{40}$/.test(value)) return value.toLowerCase();
  return null;
}

export function parseTxHash(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (/^0x[a-fA-F0-9]{64}$/.test(value)) return value.toLowerCase();
  return null;
}

export function parseUrl(value: unknown): URL | null {
  if (typeof value !== "string") return null;
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export function parseJson<T>(value: unknown): T | null {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }
  if (typeof value === "object" && value !== null) {
    return value as T;
  }
  return null;
}

export function parseCsvLine(line: string, delimiter: string = ","): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }

  result.push(current);
  return result;
}
