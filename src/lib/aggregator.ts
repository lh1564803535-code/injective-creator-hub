/**
 * Aggregator utilities
 */

export function sum(numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return sum(numbers) / numbers.length;
}

export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function min(numbers: number[]): number {
  return Math.min(...numbers);
}

export function max(numbers: number[]): number {
  return Math.max(...numbers);
}

export function range(numbers: number[]): { min: number; max: number; range: number } {
  const minVal = min(numbers);
  const maxVal = max(numbers);
  return { min: minVal, max: maxVal, range: maxVal - minVal };
}

export function standardDeviation(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const avg = average(numbers);
  const squareDiffs = numbers.map((num) => Math.pow(num - avg, 2));
  return Math.sqrt(average(squareDiffs));
}

export function percentile(numbers: number[], p: number): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const fraction = index - lower;
  return sorted[lower] + fraction * (sorted[upper] - sorted[lower]);
}

export function weightedAverage(values: number[], weights: number[]): number {
  if (values.length !== weights.length) {
    throw new Error("Values and weights must have the same length");
  }
  const totalWeight = sum(weights);
  if (totalWeight === 0) return 0;
  const weightedSum = values.reduce((acc, val, i) => acc + val * weights[i], 0);
  return weightedSum / totalWeight;
}

export function groupBy<T, K extends string | number>(
  items: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return items.reduce((groups, item) => {
    const key = keyFn(item);
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
}

export function countBy<T, K extends string | number>(
  items: T[],
  keyFn: (item: T) => K
): Record<K, number> {
  return items.reduce((counts, item) => {
    const key = keyFn(item);
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {} as Record<K, number>);
}

export function frequency<T>(items: T[]): Map<T, number> {
  const freq = new Map<T, number>();
  items.forEach((item) => {
    freq.set(item, (freq.get(item) || 0) + 1);
  });
  return freq;
}

export function topN<T>(items: T[], n: number, keyFn: (item: T) => number): T[] {
  return [...items].sort((a, b) => keyFn(b) - keyFn(a)).slice(0, n);
}

export function bottomN<T>(items: T[], n: number, keyFn: (item: T) => number): T[] {
  return [...items].sort((a, b) => keyFn(a) - keyFn(b)).slice(0, n);
}

export function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

export function uniqueBy<T, K>(items: T[], keyFn: (item: T) => K): T[] {
  const seen = new Set<K>();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function duplicates<T>(items: T[]): T[] {
  const seen = new Set<T>();
  const dupes = new Set<T>();
  items.forEach((item) => {
    if (seen.has(item)) {
      dupes.add(item);
    }
    seen.add(item);
  });
  return [...dupes];
}

export function duplicatesBy<T, K>(items: T[], keyFn: (item: T) => K): T[] {
  const seen = new Set<K>();
  const dupes: T[] = [];
  items.forEach((item) => {
    const key = keyFn(item);
    if (seen.has(key)) {
      dupes.push(item);
    }
    seen.add(key);
  });
  return dupes;
}
