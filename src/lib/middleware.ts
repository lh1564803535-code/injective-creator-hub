/**
 * Middleware utilities
 */

type Middleware<T> = (context: T, next: () => Promise<void>) => Promise<void>;

class MiddlewarePipeline<T> {
  private middlewares: Middleware<T>[] = [];

  use(middleware: Middleware<T>): void {
    this.middlewares.push(middleware);
  }

  async execute(context: T): Promise<void> {
    let index = 0;

    const next = async (): Promise<void> => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++];
        await middleware(context, next);
      }
    };

    await next();
  }

  remove(middleware: Middleware<T>): void {
    const index = this.middlewares.indexOf(middleware);
    if (index > -1) {
      this.middlewares.splice(index, 1);
    }
  }

  clear(): void {
    this.middlewares = [];
  }

  getCount(): number {
    return this.middlewares.length;
  }
}

export function createMiddlewarePipeline<T>(): MiddlewarePipeline<T> {
  return new MiddlewarePipeline<T>();
}

export function compose<T>(...middlewares: Middleware<T>[]): Middleware<T> {
  return async (context: T, next: () => Promise<void>) => {
    let index = 0;

    const run = async (): Promise<void> => {
      if (index < middlewares.length) {
        const middleware = middlewares[index++];
        await middleware(context, run);
      } else {
        await next();
      }
    };

    await run();
  };
}

export function loggingMiddleware<T>(
  logger: (context: T, duration: number) => void
): Middleware<T> {
  return async (context: T, next: () => Promise<void>) => {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;
    logger(context, duration);
  };
}

export function errorHandlingMiddleware<T>(
  handler: (error: Error, context: T) => void
): Middleware<T> {
  return async (context: T, next: () => Promise<void>) => {
    try {
      await next();
    } catch (error) {
      handler(error instanceof Error ? error : new Error(String(error)), context);
    }
  };
}

export function timingMiddleware<T>(): Middleware<T> & { getTimings: () => Record<string, number> } {
  const timings: Record<string, number> = {};

  const middleware: Middleware<T> = async (context: T, next: () => Promise<void>) => {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;
    timings["total"] = (timings["total"] || 0) + duration;
  };

  return Object.assign(middleware, {
    getTimings: () => ({ ...timings }),
  });
}

export function validationMiddleware<T>(
  validator: (context: T) => boolean | string
): Middleware<T> {
  return async (context: T, next: () => Promise<void>) => {
    const result = validator(context);
    if (result === false) {
      throw new Error("Validation failed");
    }
    if (typeof result === "string") {
      throw new Error(result);
    }
    await next();
  };
}

export function rateLimitMiddleware<T>(
  maxRequests: number,
  windowMs: number
): Middleware<T> {
  const requests: number[] = [];

  return async (context: T, next: () => Promise<void>) => {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old requests
    while (requests.length > 0 && requests[0] < windowStart) {
      requests.shift();
    }

    if (requests.length >= maxRequests) {
      throw new Error("Rate limit exceeded");
    }

    requests.push(now);
    await next();
  };
}
