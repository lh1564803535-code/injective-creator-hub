/**
 * Sanitizer utilities
 */

export function sanitizeString(value: string): string {
  return value
    .replace(/[<>]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .trim();
}

export function sanitizeHtml(html: string): string {
  const div = document.createElement("div");
  div.textContent = html;
  return div.innerHTML;
}

export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
}

export function sanitizeNumber(value: unknown): number | null {
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) return null;
  return num;
}

export function sanitizeInteger(value: unknown): number | null {
  const num = sanitizeNumber(value);
  if (num === null) return null;
  return Math.floor(num);
}

export function sanitizeBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return value.toLowerCase() === "true" || value === "1";
  }
  return Boolean(value);
}

export function sanitizeArray<T>(value: unknown, sanitizer: (item: unknown) => T | null): T[] {
  if (!Array.isArray(value)) return [];
  return value.map(sanitizer).filter((item): item is T => item !== null);
}

export function sanitizeObject<T extends Record<string, unknown>>(
  value: unknown,
  schema: Record<string, (value: unknown) => unknown>
): Partial<T> {
  if (typeof value !== "object" || value === null) return {};
  const result: Record<string, unknown> = {};
  for (const [key, sanitizer] of Object.entries(schema)) {
    if (key in (value as Record<string, unknown>)) {
      result[key] = sanitizer((value as Record<string, unknown>)[key]);
    }
  }
  return result as Partial<T>;
}

export function sanitizeEthereumAddress(address: string): string {
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return "";
  return address.toLowerCase();
}

export function sanitizeTransactionHash(hash: string): string {
  if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) return "";
  return hash.toLowerCase();
}

export function sanitizeBigInt(value: unknown): bigint | null {
  try {
    if (typeof value === "bigint") return value;
    if (typeof value === "string") return BigInt(value);
    if (typeof value === "number") return BigInt(Math.floor(value));
    return null;
  } catch {
    return null;
  }
}

export function sanitizeDate(value: unknown): Date | null {
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date;
  }
  return null;
}

export function sanitizeTimestamp(value: unknown): number | null {
  const date = sanitizeDate(value);
  return date ? date.getTime() : null;
}

// Sanitize for logging (remove sensitive data)
export function sanitizeForLog(data: Record<string, unknown>): Record<string, unknown> {
  const sensitiveKeys = ["password", "secret", "token", "key", "privateKey", "mnemonic"];
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (sensitiveKeys.some((k) => key.toLowerCase().includes(k))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeForLog(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
