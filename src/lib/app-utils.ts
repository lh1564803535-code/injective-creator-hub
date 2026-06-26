/**
 * App utilities
 */

// App configuration
interface AppConfig {
  name: string;
  version: string;
  environment: "development" | "staging" | "production";
  features: Record<string, boolean>;
  api: {
    baseUrl: string;
    timeout: number;
  };
  ui: {
    theme: "dark" | "light";
    language: string;
    timezone: string;
  };
}

class AppConfigManager {
  private config: AppConfig;

  constructor(initialConfig: AppConfig) {
    this.config = { ...initialConfig };
  }

  get(): AppConfig {
    return { ...this.config };
  }

  getFeature(key: string): boolean {
    return this.config.features[key] ?? false;
  }

  setFeature(key: string, enabled: boolean): void {
    this.config.features[key] = enabled;
  }

  update(updates: Partial<AppConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  isDevelopment(): boolean {
    return this.config.environment === "development";
  }

  isStaging(): boolean {
    return this.config.environment === "staging";
  }

  isProduction(): boolean {
    return this.config.environment === "production";
  }
}

export function createAppConfigManager(initialConfig: AppConfig): AppConfigManager {
  return new AppConfigManager(initialConfig);
}

// App lifecycle
type AppLifecycleEvent = "init" | "ready" | "error" | "shutdown";

class AppLifecycle {
  private handlers: Map<AppLifecycleEvent, Set<() => void>> = new Map();

  on(event: AppLifecycleEvent, handler: () => void): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
    return () => this.handlers.get(event)?.delete(handler);
  }

  async emit(event: AppLifecycleEvent): Promise<void> {
    const handlers = this.handlers.get(event);
    if (handlers) {
      for (const handler of handlers) {
        try {
          await handler();
        } catch (error) {
          console.error(`Error in lifecycle handler for "${event}":`, error);
        }
      }
    }
  }

  clear(): void {
    this.handlers.clear();
  }
}

export function createAppLifecycle(): AppLifecycle {
  return new AppLifecycle();
}

// App state
interface AppState {
  initialized: boolean;
  loading: boolean;
  error: Error | null;
  user: {
    authenticated: boolean;
    address: string | null;
  };
}

class AppStateManager {
  private state: AppState;
  private listeners: Set<(state: AppState) => void> = new Set();

  constructor(initialState: AppState) {
    this.state = { ...initialState };
  }

  get(): AppState {
    return { ...this.state };
  }

  update(updates: Partial<AppState>): void {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  setLoading(loading: boolean): void {
    this.update({ loading });
  }

  setError(error: Error | null): void {
    this.update({ error });
  }

  setUser(user: AppState["user"]): void {
    this.update({ user });
  }

  reset(): void {
    this.state = {
      initialized: false,
      loading: false,
      error: null,
      user: { authenticated: false, address: null },
    };
    this.notify();
  }

  subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.get());
      } catch (error) {
        console.error("Error in state listener:", error);
      }
    });
  }
}

export function createAppStateManager(initialState: AppState): AppStateManager {
  return new AppStateManager(initialState);
}

// App utils
export function getAppVersion(): string {
  return process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0";
}

export function getAppEnvironment(): string {
  return process.env.NODE_ENV || "development";
}

export function isAppDevelopment(): boolean {
  return getAppEnvironment() === "development";
}

export function isAppProduction(): boolean {
  return getAppEnvironment() === "production";
}

export function getAppBaseUrl(): string {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}
