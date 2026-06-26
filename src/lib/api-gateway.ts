/**
 * API Gateway utilities
 */

interface Route {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  handler: (req: Request) => Promise<Response>;
  middleware?: Middleware[];
}

type Middleware = (req: Request, next: (req: Request) => Promise<Response>) => Promise<Response>;

class Router {
  private routes: Route[] = [];

  add(route: Route): void {
    this.routes.push(route);
  }

  async handle(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const method = req.method;

    for (const route of this.routes) {
      if (this.matchPath(route.path, url.pathname) && route.method === method) {
        let handler = route.handler;

        // Apply middleware in reverse order
        if (route.middleware) {
          for (const mw of route.middleware.reverse()) {
            const nextHandler = handler;
            handler = async (req: Request) => mw(req, nextHandler);
          }
        }

        return handler(req);
      }
    }

    return new Response("Not Found", { status: 404 });
  }

  private matchPath(pattern: string, path: string): boolean {
    const patternParts = pattern.split("/");
    const pathParts = path.split("/");

    if (patternParts.length !== pathParts.length) return false;

    return patternParts.every((part, i) => {
      if (part.startsWith(":")) return true; // Parameter
      return part === pathParts[i];
    });
  }

  getRoutes(): Route[] {
    return [...this.routes];
  }
}

export function createRouter(): Router {
  return new Router();
}

// Rate Limiter Middleware
export function rateLimitMiddleware(
  maxRequests: number,
  windowMs: number
): Middleware {
  const requests: Map<string, number[]> = new Map();

  return async (req, next) => {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old requests
    const ipRequests = requests.get(ip) || [];
    const recentRequests = ipRequests.filter((time) => time > windowStart);

    if (recentRequests.length >= maxRequests) {
      return new Response("Too Many Requests", { status: 429 });
    }

    recentRequests.push(now);
    requests.set(ip, recentRequests);

    return next(req);
  };
}

// Auth Middleware
export function authMiddleware(
  validateToken: (token: string) => Promise<boolean>
): Middleware {
  return async (req, next) => {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401 });
    }

    const token = authHeader.slice(7);
    const isValid = await validateToken(token);

    if (!isValid) {
      return new Response("Unauthorized", { status: 401 });
    }

    return next(req);
  };
}

// CORS Middleware
export function corsMiddleware(
  origins: string[] = ["*"],
  methods: string[] = ["GET", "POST", "PUT", "DELETE"],
  headers: string[] = ["Content-Type", "Authorization"]
): Middleware {
  return async (req, next) => {
    const origin = req.headers.get("origin") || "";

    if (origins.includes("*") || origins.includes(origin)) {
      const response = await next(req);
      const newHeaders = new Headers(response.headers);
      newHeaders.set("Access-Control-Allow-Origin", origin);
      newHeaders.set("Access-Control-Allow-Methods", methods.join(", "));
      newHeaders.set("Access-Control-Allow-Headers", headers.join(", "));

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    }

    return next(req);
  };
}

// Logging Middleware
export function loggingMiddleware(): Middleware {
  return async (req, next) => {
    const start = Date.now();
    const response = await next(req);
    const duration = Date.now() - start;

    console.log(
      `${req.method} ${new URL(req.url).pathname} - ${response.status} - ${duration}ms`
    );

    return response;
  };
}

// Cache Middleware
export function cacheMiddleware(ttl: number = 60): Middleware {
  const cache = new Map<string, { response: Response; expiry: number }>();

  return async (req, next) => {
    const cacheKey = `${req.method}:${req.url}`;
    const now = Date.now();
    const cached = cache.get(cacheKey);

    if (cached && cached.expiry > now) {
      return cached.response.clone();
    }

    const response = await next(req);

    if (response.ok) {
      cache.set(cacheKey, {
        response: response.clone(),
        expiry: now + ttl * 1000,
      });
    }

    return response;
  };
}
