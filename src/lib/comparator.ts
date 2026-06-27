/**
 * Comparator utilities
 */

type Comparator<T> = (a: T, b: T) => number;

export function createComparator<T>(fn: Comparator<T>): Comparator<T> {
  return fn;
}

export function ascending<T>(keyFn: (item: T) => number | string): Comparator<T> {
  return (a, b) => {
    const aVal = keyFn(a);
    const bVal = keyFn(b);
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  };
}

export function descending<T>(keyFn: (item: T) => number | string): Comparator<T> {
  return (a, b) => {
    const aVal = keyFn(a);
    const bVal = keyFn(b);
    if (aVal > bVal) return -1;
    if (aVal < bVal) return 1;
    return 0;
  };
}

export function composeComparators<T>(...comparators: Comparator<T>[]): Comparator<T> {
  return (a, b) => {
    for (const comparator of comparators) {
      const result = comparator(a, b);
      if (result !== 0) return result;
    }
    return 0;
  };
}

export function reverse<T>(comparator: Comparator<T>): Comparator<T> {
  return (a, b) => comparator(b, a);
}

export function nullsFirst<T>(comparator: Comparator<T>): Comparator<T> {
  return (a, b) => {
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;
    return comparator(a, b);
  };
}

export function nullsLast<T>(comparator: Comparator<T>): Comparator<T> {
  return (a, b) => {
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    return comparator(a, b);
  };
}

export function natural<T>(keyFn: (item: T) => string): Comparator<T> {
  return (a, b) => {
    const aStr = keyFn(a);
    const bStr = keyFn(b);
    return aStr.localeCompare(bStr, undefined, { numeric: true, sensitivity: "base" });
  };
}

export function byLength(): Comparator<string> {
  return (a, b) => a.length - b.length;
}

export function byDate(direction: "asc" | "desc" = "asc"): Comparator<Date> {
  return direction === "asc"
    ? (a, b) => a.getTime() - b.getTime()
    : (a, b) => b.getTime() - a.getTime();
}

export function byTimestamp(direction: "asc" | "desc" = "asc"): Comparator<number> {
  return direction === "asc" ? (a, b) => a - b : (a, b) => b - a;
}

export function byString(direction: "asc" | "desc" = "asc"): Comparator<string> {
  return direction === "asc"
    ? (a, b) => a.localeCompare(b)
    : (a, b) => b.localeCompare(a);
}

export function byNumber(direction: "asc" | "desc" = "asc"): Comparator<number> {
  return direction === "asc" ? (a, b) => a - b : (a, b) => b - a;
}

export function byBoolean(direction: "asc" | "desc" = "asc"): Comparator<boolean> {
  return direction === "asc"
    ? (a, b) => (a === b ? 0 : a ? 1 : -1)
    : (a, b) => (a === b ? 0 : a ? -1 : 1);
}

export function stable<T>(comparator: Comparator<T>): Comparator<T> {
  let counter = 0;
  const indices = new Map<T, number>();

  return (a, b) => {
    if (!indices.has(a)) indices.set(a, counter++);
    if (!indices.has(b)) indices.set(b, counter++);

    const result = comparator(a, b);
    if (result !== 0) return result;

    return indices.get(a)! - indices.get(b)!;
  };
}
