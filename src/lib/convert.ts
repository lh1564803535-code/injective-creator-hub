/**
 * Convert utilities
 */

export function hexToNumber(hex: string): number {
  return parseInt(hex.replace(/^0x/, ""), 16);
}

export function numberToHex(num: number): string {
  return "0x" + num.toString(16);
}

export function hexToBigInt(hex: string): bigint {
  return BigInt(hex.startsWith("0x") ? hex : `0x${hex}`);
}

export function bigIntToHex(num: bigint): string {
  return "0x" + num.toString(16);
}

export function utf8ToHex(str: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  return "0x" + Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function hexToUtf8(hex: string): string {
  const bytes = hexToBytes(hex);
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

export function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }
  return bytes;
}

export function bytesToHex(bytes: Uint8Array): string {
  return "0x" + Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function base64ToHex(base64: string): string {
  const binary = atob(base64);
  return "0x" + Array.from(binary).map((char) => char.charCodeAt(0).toString(16).padStart(2, "0")).join("");
}

export function hexToBase64(hex: string): string {
  const bytes = hexToBytes(hex);
  const binary = Array.from(bytes).map((b) => String.fromCharCode(b)).join("");
  return btoa(binary);
}

export function weiToEther(wei: bigint): number {
  return Number(wei) / 1e18;
}

export function etherToWei(ether: number): bigint {
  return BigInt(Math.floor(ether * 1e18));
}

export function gweiToWei(gwei: number): bigint {
  return BigInt(Math.floor(gwei * 1e9));
}

export function weiToGwei(wei: bigint): number {
  return Number(wei) / 1e9;
}

export function usdcToAmount(usdc: number): bigint {
  return BigInt(Math.floor(usdc * 1e6));
}

export function amountToUsdc(amount: bigint): number {
  return Number(amount) / 1e6;
}

export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

export function dateToTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

export function kmToMiles(km: number): number {
  return km * 0.621371;
}

export function milesToKm(miles: number): number {
  return miles * 1.60934;
}
