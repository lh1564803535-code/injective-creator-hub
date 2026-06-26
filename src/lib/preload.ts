/**
 * Preload utilities
 */

interface PreloadConfig {
  maxConcurrent: number;
  timeout: number;
  retryCount: number;
  retryDelay: number;
}

class PreloadManager {
  private queue: Array<{ url: string; type: string; priority: number }> = [];
  private loading: Set<string> = new Set();
  private loaded: Set<string> = new Set();
  private config: PreloadConfig;

  constructor(config: PreloadConfig) {
    this.config = config;
  }

  add(url: string, type: string = "fetch", priority: number = 0): void {
    if (this.loaded.has(url) || this.loading.has(url)) return;

    this.queue.push({ url, type, priority });
    this.queue.sort((a, b) => b.priority - a.priority);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    while (this.loading.size < this.config.maxConcurrent && this.queue.length > 0) {
      const item = this.queue.shift()!;
      this.loading.add(item.url);
      this.preloadItem(item);
    }
  }

  private async preloadItem(item: { url: string; type: string }): Promise<void> {
    try {
      switch (item.type) {
        case "image":
          await this.preloadImage(item.url);
          break;
        case "script":
          await this.preloadScript(item.url);
          break;
        case "style":
          await this.preloadStyle(item.url);
          break;
        case "fetch":
        default:
          await this.preloadFetch(item.url);
          break;
      }
      this.loaded.add(item.url);
    } catch (error) {
      console.warn(`Failed to preload ${item.url}:`, error);
    } finally {
      this.loading.delete(item.url);
      this.processQueue();
    }
  }

  private preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
  }

  private preloadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  private preloadStyle(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      link.onload = () => resolve();
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  private async preloadFetch(url: string): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      await fetch(url, { signal: controller.signal, method: "HEAD" });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  isLoaded(url: string): boolean {
    return this.loaded.has(url);
  }

  isLoading(url: string): boolean {
    return this.loading.has(url);
  }

  getLoadedCount(): number {
    return this.loaded.size;
  }

  getLoadingCount(): number {
    return this.loading.size;
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  clear(): void {
    this.queue = [];
    this.loading.clear();
    this.loaded.clear();
  }
}

export function createPreloadManager(config?: Partial<PreloadConfig>): PreloadManager {
  return new PreloadManager({
    maxConcurrent: 3,
    timeout: 10000,
    retryCount: 2,
    retryDelay: 1000,
    ...config,
  });
}

// Global preload manager
let globalPreloadManager: PreloadManager | null = null;

export function getGlobalPreloadManager(): PreloadManager {
  if (!globalPreloadManager) {
    globalPreloadManager = createPreloadManager();
  }
  return globalPreloadManager;
}

export function setGlobalPreloadManager(manager: PreloadManager): void {
  globalPreloadManager = manager;
}

// Convenience functions
export function preload(url: string, type?: string, priority?: number): void {
  getGlobalPreloadManager().add(url, type, priority);
}

export function preloadImage(url: string): void {
  getGlobalPreloadManager().add(url, "image", 10);
}

export function preloadScript(url: string): void {
  getGlobalPreloadManager().add(url, "script", 5);
}

export function preloadStyle(url: string): void {
  getGlobalPreloadManager().add(url, "style", 5);
}

export function isPreloaded(url: string): boolean {
  return getGlobalPreloadManager().isLoaded(url);
}

export function isPreloading(url: string): boolean {
  return getGlobalPreloadManager().isLoading(url);
}

export function clearPreload(): void {
  getGlobalPreloadManager().clear();
}
