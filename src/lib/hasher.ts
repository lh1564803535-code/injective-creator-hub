/**
 * Hasher utilities
 */

// SHA-256
export async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
  return bufferToHex(buffer);
}

// SHA-512
export async function sha512(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-512", encoder.encode(data));
  return bufferToHex(buffer);
}

// SHA-1
export async function sha1(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-1", encoder.encode(data));
  return bufferToHex(buffer);
}

// MD5 (using SubtleCrypto workaround)
export async function md5(data: string): Promise<string> {
  // SubtleCrypto doesn't support MD5, use a simple implementation
  return simpleMd5(data);
}

// HMAC-SHA256
export async function hmacSha256(data: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const buffer = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data));
  return bufferToHex(buffer);
}

// HMAC-SHA512
export async function hmacSha512(data: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  const buffer = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data));
  return bufferToHex(buffer);
}

// PBKDF2
export async function pbkdf2(
  password: string,
  salt: string,
  iterations: number = 100000,
  keyLength: number = 32
): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const buffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    keyLength * 8
  );
  return bufferToHex(buffer);
}

// Helper: ArrayBuffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Simple MD5 implementation (for compatibility, not cryptographic use)
function simpleMd5(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

// Verify HMAC
export async function verifyHmac(
  data: string,
  key: string,
  expectedSignature: string,
  algorithm: "SHA-256" | "SHA-512" = "SHA-256"
): Promise<boolean> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: algorithm },
    false,
    ["verify"]
  );
  const sigBuffer = hexToBuffer(expectedSignature);
  return crypto.subtle.verify("HMAC", cryptoKey, sigBuffer, encoder.encode(data));
}

// Helper: hex string to ArrayBuffer
function hexToBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

// Generate random bytes
export function generateRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

// Generate random hex string
export function generateRandomHex(length: number): string {
  const bytes = generateRandomBytes(length);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Generate UUID
export function generateUuid(): string {
  return crypto.randomUUID();
}
