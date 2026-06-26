/**
 * Performance monitoring utilities
 */

export function measurePerformance(name: string, fn: () => void): void {
  if (typeof window === "undefined") return fn();

  const start = performance.now();
  fn();
  const end = performance.now();

  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
  }
}

export async function measureAsyncPerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  if (typeof window === "undefined") return fn();

  const start = performance.now();
  const result = await fn();
  const end = performance.now();

  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
  }

  return result;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
