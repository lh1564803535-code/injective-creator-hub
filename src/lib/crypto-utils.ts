/**
 * Crypto utilities
 */

export function generateRandomId(length: number = 16): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function generateUUID(): string {
  return crypto.randomUUID();
}

export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function hashPassword(password: string, salt?: string): Promise<string> {
  const saltValue = salt || generateRandomId(16);
  const combined = password + saltValue;
  const hash = await hashString(combined);
  return `${saltValue}:${hash}`;
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const [salt, hash] = hashedPassword.split(":");
  const combined = password + salt;
  const newHash = await hashString(combined);
  return newHash === hash;
}

export function encodeBase64(str: string): string {
  return btoa(str);
}

export function decodeBase64(encoded: string): string {
  return atob(encoded);
}

export function encodeBase64Url(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeBase64Url(encoded: string): string {
  let str = encoded.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return atob(str);
}

export function xorEncrypt(data: string, key: string): string {
  let result = "";
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(
      data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return encodeBase64(result);
}

export function xorDecrypt(encrypted: string, key: string): string {
  const data = decodeBase64(encrypted);
  let result = "";
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(
      data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return result;
}
