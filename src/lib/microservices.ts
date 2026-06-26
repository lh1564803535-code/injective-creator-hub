/**
 * Microservices utilities
 */

// Service Registry
class ServiceRegistry {
  private services: Map<string, ServiceInstance> = new Map();

  register(name: string, instance: ServiceInstance): void {
    this.services.set(name, instance);
  }

  deregister(name: string): void {
    this.services.delete(name);
  }

  discover(name: string): ServiceInstance | undefined {
    return this.services.get(name);
  }

  getAll(): ServiceInstance[] {
    return Array.from(this.services.values());
  }

  getHealthy(): ServiceInstance[] {
    return this.getAll().filter((s) => s.status === "healthy");
  }
}

interface ServiceInstance {
  name: string;
  url: string;
  status: "healthy" | "unhealthy" | "unknown";
  lastCheck: number;
  metadata: Record<string, unknown>;
}

export function createServiceRegistry(): ServiceRegistry {
  return new ServiceRegistry();
}

// Message Bus
interface Message<T = unknown> {
  id: string;
  type: string;
  payload: T;
  timestamp: number;
  source: string;
  correlationId?: string;
}

class MessageBus {
  private handlers: Map<string, Set<(message: Message) => void>> = new Map();
  private queue: Message[] = [];

  publish<T>(type: string, payload: T, source: string): void {
    const message: Message<T> = {
      id: crypto.randomUUID(),
      type,
      payload,
      timestamp: Date.now(),
      source,
    };

    this.queue.push(message);
    this.processQueue();
  }

  subscribe(type: string, handler: (message: Message) => void): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);
    return () => this.handlers.get(type)?.delete(handler);
  }

  private processQueue(): void {
    while (this.queue.length > 0) {
      const message = this.queue.shift()!;
      const handlers = this.handlers.get(message.type);
      if (handlers) {
        handlers.forEach((handler) => {
          try {
            handler(message);
          } catch (error) {
            console.error(`Error handling message ${message.type}:`, error);
          }
        });
      }
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
    this.handlers.clear();
  }
}

export function createMessageBus(): MessageBus {
  return new MessageBus();
}

// Circuit Breaker
class CircuitBreaker {
  private state: "closed" | "open" | "half-open" = "closed";
  private failureCount: number = 0;
  private lastFailureTime: number = 0;

  constructor(
    private failureThreshold: number = 5,
    private resetTimeout: number = 60000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.lastFailureTime >= this.resetTimeout) {
        this.state = "half-open";
      } else {
        throw new Error("Circuit breaker is open");
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = "closed";
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.state = "open";
    }
  }

  getState(): string {
    return this.state;
  }

  reset(): void {
    this.state = "closed";
    this.failureCount = 0;
    this.lastFailureTime = 0;
  }
}

export function createCircuitBreaker(
  failureThreshold?: number,
  resetTimeout?: number
): CircuitBreaker {
  return new CircuitBreaker(failureThreshold, resetTimeout);
}

// Retry with backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  maxDelay: number = 30000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// Health Check
interface HealthStatus {
  status: "healthy" | "unhealthy" | "degraded";
  checks: HealthCheck[];
  timestamp: number;
}

interface HealthCheck {
  name: string;
  status: "healthy" | "unhealthy";
  message?: string;
  duration: number;
}

export async function checkHealth(
  checks: Array<() => Promise<HealthCheck>>
): Promise<HealthStatus> {
  const results: HealthCheck[] = [];
  let status: "healthy" | "unhealthy" | "degraded" = "healthy";

  for (const check of checks) {
    try {
      const result = await check();
      results.push(result);
      if (result.status === "unhealthy") {
        status = "unhealthy";
      }
    } catch (error) {
      results.push({
        name: "unknown",
        status: "unhealthy",
        message: error instanceof Error ? error.message : "Unknown error",
        duration: 0,
      });
      status = "unhealthy";
    }
  }

  return {
    status,
    check: results,
    timestamp: Date.now(),
  };
}
