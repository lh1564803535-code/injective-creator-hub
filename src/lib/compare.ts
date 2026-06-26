/**
 * Compare utilities
 */

export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (typeof a === "object") {
    if (Array.isArray(a) !== Array.isArray(b)) return false;

    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);

    if (keysA.length !== keysB.length) return false;

    return keysA.every((key) =>
      isEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
    );
  }

  return false;
}

export function isDeepEqual(a: unknown, b: unknown): boolean {
  return isEqual(a, b);
}

export function isShallowEqual(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => a[key] === b[key]);
}

export function compareStrings(a: string, b: string, caseSensitive: boolean = true): number {
  if (!caseSensitive) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  }
  return a.localeCompare(b);
}

export function compareNumbers(a: number, b: number): number {
  return a - b;
}

export function compareDates(a: Date, b: Date): number {
  return a.getTime() - b.getTime();
}

export function compareBigInts(a: bigint, b: bigint): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

export function isBetween(value: number, min: number, max: number): boolean {
  return value > min && value < max;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function inverseLerp(start: number, end: number, value: number): number {
  if (start === end) return 0;
  return (value - start) / (end - start);
}

export function remap(
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number {
  const t = inverseLerp(fromMin, fromMax, value);
  return lerp(toMin, toMax, t);
}
