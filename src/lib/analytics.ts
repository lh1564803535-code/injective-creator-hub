/**
 * Analytics utilities
 */

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private listeners: Set<(event: AnalyticsEvent) => void> = new Set();
  private sessionId: string = crypto.randomUUID();

  track(name: string, properties?: Record<string, unknown>, userId?: string): void {
    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: Date.now(),
      userId,
      sessionId: this.sessionId,
    };

    this.events.push(event);
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error("Error in analytics listener:", error);
      }
    });
  }

  page(name: string, properties?: Record<string, unknown>): void {
    this.track("page_view", { page: name, ...properties });
  }

  identify(userId: string, traits?: Record<string, unknown>): void {
    this.track("identify", { userId, ...traits }, userId);
  }

  group(groupId: string, properties?: Record<string, unknown>): void {
    this.track("group", { groupId, ...properties });
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  getEventsByName(name: string): AnalyticsEvent[] {
    return this.events.filter((e) => e.name === name);
  }

  getSessionId(): string {
    return this.sessionId;
  }

  subscribe(listener: (event: AnalyticsEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  clear(): void {
    this.events = [];
  }
}

export function createAnalytics(): Analytics {
  return new Analytics();
}

// Global analytics
let globalAnalytics: Analytics | null = null;

export function getGlobalAnalytics(): Analytics {
  if (!globalAnalytics) {
    globalAnalytics = createAnalytics();
  }
  return globalAnalytics;
}

export function setGlobalAnalytics(analytics: Analytics): void {
  globalAnalytics = analytics;
}

// Convenience functions
export function trackEvent(name: string, properties?: Record<string, unknown>, userId?: string): void {
  getGlobalAnalytics().track(name, properties, userId);
}

export function trackPageView(name: string, properties?: Record<string, unknown>): void {
  getGlobalAnalytics().page(name, properties);
}

export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
  getGlobalAnalytics().identify(userId, traits);
}

export function trackGroup(groupId: string, properties?: Record<string, unknown>): void {
  getGlobalAnalytics().group(groupId, properties);
}

// Performance tracking
interface PerformanceMetric {
  name: string;
  value: number;
  unit: "ms" | "bytes" | "count";
  timestamp: number;
}

class PerformanceTracker {
  private metrics: PerformanceMetric[] = [];

  record(name: string, value: number, unit: PerformanceMetric["unit"]): void {
    this.metrics.push({
      name,
      value,
      unit,
      timestamp: Date.now(),
    });
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter((m) => m.name === name);
  }

  clear(): void {
    this.metrics = [];
  }
}

export function createPerformanceTracker(): PerformanceTracker {
  return new PerformanceTracker();
}

// Global performance tracker
let globalPerformanceTracker: PerformanceTracker | null = null;

export function getGlobalPerformanceTracker(): PerformanceTracker {
  if (!globalPerformanceTracker) {
    globalPerformanceTracker = createPerformanceTracker();
  }
  return globalPerformanceTracker;
}

export function recordPerformance(name: string, value: number, unit: PerformanceMetric["unit"]): void {
  getGlobalPerformanceTracker().record(name, value, unit);
}
