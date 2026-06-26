/**
 * Performance utilities
 */

interface PerfMark {
  name: string;
  timestamp: number;
}

interface PerfMeasure {
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
}

class PerfMonitor {
  private marks: Map<string, PerfMark> = new Map();
  private measures: PerfMeasure[] = [];

  mark(name: string): void {
    this.marks.set(name, {
      name,
      timestamp: performance.now(),
    });
  }

  measure(name: string, startMark: string, endMark?: string): PerfMeasure | null {
    const start = this.marks.get(startMark);
    if (!start) return null;

    const endTime = endMark ? this.marks.get(endMark)?.timestamp ?? performance.now() : performance.now();
    const duration = endTime - start.timestamp;

    const measure: PerfMeasure = {
      name,
      duration,
      startTime: start.timestamp,
      endTime,
    };

    this.measures.push(measure);
    return measure;
  }

  getMeasures(): PerfMeasure[] {
    return [...this.measures];
  }

  getMeasureByName(name: string): PerfMeasure | undefined {
    return this.measures.find((m) => m.name === name);
  }

  getMarks(): PerfMark[] {
    return Array.from(this.marks.values());
  }

  clear(): void {
    this.marks.clear();
    this.measures = [];
  }
}

export function createPerfMonitor(): PerfMonitor {
  return new PerfMonitor();
}

// Global perf monitor
let globalPerfMonitor: PerfMonitor | null = null;

export function getGlobalPerfMonitor(): PerfMonitor {
  if (!globalPerfMonitor) {
    globalPerfMonitor = createPerfMonitor();
  }
  return globalPerfMonitor;
}

export function setGlobalPerfMonitor(monitor: PerfMonitor): void {
  globalPerfMonitor = monitor;
}

// Convenience functions
export function perfMark(name: string): void {
  getGlobalPerfMonitor().mark(name);
}

export function perfMeasure(name: string, startMark: string, endMark?: string): PerfMeasure | null {
  return getGlobalPerfMonitor().measure(name, startMark, endMark);
}

export function getPerfMeasures(): PerfMeasure[] {
  return getGlobalPerfMonitor().getMeasures();
}

export function clearPerf(): void {
  getGlobalPerfMonitor().clear();
}

// Timing decorator
export function timing<T extends (...args: unknown[]) => unknown>(
  fn: T,
  name?: string
): T {
  const fnName = name || fn.name || "anonymous";

  return ((...args: unknown[]) => {
    const start = performance.now();
    const result = fn(...args);
    const duration = performance.now() - start;

    console.log(`[Perf] ${fnName}: ${duration.toFixed(2)}ms`);
    return result;
  }) as T;
}

// Async timing decorator
export function asyncTiming<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  name?: string
): T {
  const fnName = name || fn.name || "anonymous";

  return (async (...args: unknown[]) => {
    const start = performance.now();
    const result = await fn(...args);
    const duration = performance.now() - start;

    console.log(`[Perf] ${fnName}: ${duration.toFixed(2)}ms`);
    return result;
  }) as T;
}

// FPS monitor
export function createFpsMonitor(callback: (fps: number) => void): () => void {
  let frames = 0;
  let lastTime = performance.now();
  let animationId: number;

  const tick = () => {
    frames++;
    const now = performance.now();
    const delta = now - lastTime;

    if (delta >= 1000) {
      const fps = Math.round((frames * 1000) / delta);
      callback(fps);
      frames = 0;
      lastTime = now;
    }

    animationId = requestAnimationFrame(tick);
  };

  animationId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(animationId);
}

// Memory monitor
export function getMemoryUsage(): {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
} | null {
  if (typeof performance !== "undefined" && "memory" in performance) {
    const memory = (performance as unknown as { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
    };
  }
  return null;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
