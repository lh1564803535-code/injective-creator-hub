/**
 * Encoder utilities
 */

// Base64
export function encodeBase64(data: string): string {
  return btoa(data);
}

export function decodeBase64(encoded: string): string {
  return atob(encoded);
}

// Base64URL
export function encodeBase64Url(data: string): string {
  return btoa(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeBase64Url(encoded: string): string {
  let str = encoded.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return atob(str);
}

// URL encoding
export function encodeUrl(data: string): string {
  return encodeURIComponent(data);
}

export function decodeUrl(encoded: string): string {
  return decodeURIComponent(encoded);
}

// HTML encoding
export function encodeHtml(data: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return data.replace(/[&<>"']/g, (char) => map[char]);
}

export function decodeHtml(encoded: string): string {
  const map: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#039;": "'",
  };
  return encoded.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, (entity) => map[entity]);
}

// Hex encoding
export function encodeHex(data: string): string {
  return Array.from(data)
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
}

export function decodeHex(hex: string): string {
  const bytes = hex.match(/.{1,2}/g) || [];
  return bytes.map((byte) => String.fromCharCode(parseInt(byte, 16))).join("");
}

// UTF-8
export function encodeUtf8(data: string): Uint8Array {
  return new TextEncoder().encode(data);
}

export function decodeUtf8(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

// JSON
export function encodeJson(data: unknown): string {
  return JSON.stringify(data);
}

export function decodeJson<T>(json: string): T {
  return JSON.parse(json);
}

// Safe JSON decode
export function safeDecodeJson<T>(json: string, defaults: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return defaults;
  }
}

// Binary
export function encodeBinary(data: string): Uint8Array {
  return new TextEncoder().encode(data);
}

export function decodeBinary(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

// Buffer to/from base64
export function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
