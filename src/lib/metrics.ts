/**
 * Metrics utilities
 */

interface Metric {
  name: string;
  value: number;
  labels?: Record<string, string>;
  timestamp: number;
}

class MetricsCollector {
  private metrics: Metric[] = [];
  private counters: Map<string, number> = new Map();
  private gauges: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();

  // Counter - monotonically increasing
  incrementCounter(name: string, labels?: Record<string, string>): void {
    const key = this.getKey(name, labels);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + 1);
    this.record(name, current + 1, labels);
  }

  decrementCounter(name: string, labels?: Record<string, string>): void {
    const key = this.getKey(name, labels);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, Math.max(0, current - 1));
    this.record(name, Math.max(0, current - 1), labels);
  }

  getCounter(name: string, labels?: Record<string, string>): number {
    return this.counters.get(this.getKey(name, labels)) || 0;
  }

  // Gauge - can go up and down
  setGauge(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.getKey(name, labels);
    this.gauges.set(key, value);
    this.record(name, value, labels);
  }

  getGauge(name: string, labels?: Record<string, string>): number {
    return this.gauges.get(this.getKey(name, labels)) || 0;
  }

  // Histogram - distribution of values
  observeHistogram(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.getKey(name, labels);
    if (!this.histograms.has(key)) {
      this.histograms.set(key, []);
    }
    this.histograms.get(key)!.push(value);
    this.record(name, value, labels);
  }

  getHistogram(name: string, labels?: Record<string, string>): number[] {
    return this.histograms.get(this.getKey(name, labels)) || [];
  }

  getHistogramStats(name: string, labels?: Record<string, string>): {
    count: number;
    sum: number;
    avg: number;
    min: number;
    max: number;
    p50: number;
    p95: number;
    p99: number;
  } {
    const values = this.getHistogram(name, labels);
    if (values.length === 0) {
      return { count: 0, sum: 0, avg: 0, min: 0, max: 0, p50: 0, p95: 0, p99: 0 };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);

    return {
      count: values.length,
      sum,
      avg: sum / values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  private record(name: string, value: number, labels?: Record<string, string>): void {
    this.metrics.push({
      name,
      value,
      labels,
      timestamp: Date.now(),
    });
  }

  private getKey(name: string, labels?: Record<string, string>): string {
    if (!labels) return name;
    const labelStr = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`)
      .join(",");
    return `${name}{${labelStr}}`;
  }

  getMetrics(): Metric[] {
    return [...this.metrics];
  }

  getMetricsByName(name: string): Metric[] {
    return this.metrics.filter((m) => m.name === name);
  }

  clear(): void {
    this.metrics = [];
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
  }
}

export function createMetricsCollector(): MetricsCollector {
  return new MetricsCollector();
}

// Global metrics collector
let globalMetricsCollector: MetricsCollector | null = null;

export function getGlobalMetricsCollector(): MetricsCollector {
  if (!globalMetricsCollector) {
    globalMetricsCollector = createMetricsCollector();
  }
  return globalMetricsCollector;
}

export function setGlobalMetricsCollector(collector: MetricsCollector): void {
  globalMetricsCollector = collector;
}

// Convenience functions
export function incrementMetric(name: string, labels?: Record<string, string>): void {
  getGlobalMetricsCollector().incrementCounter(name, labels);
}

export function decrementMetric(name: string, labels?: Record<string, string>): void {
  getGlobalMetricsCollector().decrementCounter(name, labels);
}

export function setMetricGauge(name: string, value: number, labels?: Record<string, string>): void {
  getGlobalMetricsCollector().setGauge(name, value, labels);
}

export function observeMetric(name: string, value: number, labels?: Record<string, string>): void {
  getGlobalMetricsCollector().observeHistogram(name, value, labels);
}

export function getMetricStats(name: string, labels?: Record<string, string>) {
  return getGlobalMetricsCollector().getHistogramStats(name, labels);
}
