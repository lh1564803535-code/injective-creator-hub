/**
 * Lazy Load utilities
 */

interface LazyLoadConfig {
  rootMargin: string;
  threshold: number;
  triggerOnce: boolean;
}

interface LazyLoadState {
  isVisible: boolean;
  hasTriggered: boolean;
}

class LazyLoadManager {
  private configs: Map<string, LazyLoadConfig> = new Map();
  private states: Map<string, LazyLoadState> = new Map();
  private observers: Map<string, IntersectionObserver> = new Map();

  register(name: string, config: LazyLoadConfig): void {
    this.configs.set(name, config);
    this.states.set(name, { isVisible: false, hasTriggered: false });
  }

  unregister(name: string): void {
    this.observers.get(name)?.disconnect();
    this.observers.delete(name);
    this.configs.delete(name);
    this.states.delete(name);
  }

  observe(name: string, element: Element, onVisible: () => void): void {
    const config = this.configs.get(name);
    if (!config) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const state = this.states.get(name);
          if (!state) return;

          if (entry.isIntersecting) {
            state.isVisible = true;
            if (!state.hasTriggered) {
              state.hasTriggered = true;
              onVisible();
            }
            if (config.triggerOnce) {
              observer.unobserve(element);
            }
          } else {
            state.isVisible = false;
          }
        });
      },
      {
        rootMargin: config.rootMargin,
        threshold: config.threshold,
      }
    );

    observer.observe(element);
    this.observers.set(name, observer);
  }

  getState(name: string): LazyLoadState | undefined {
    return this.states.get(name);
  }

  clear(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
    this.configs.clear();
    this.states.clear();
  }
}

export function createLazyLoadManager(): LazyLoadManager {
  return new LazyLoadManager();
}

export function createLazyLoadConfig(
  rootMargin: string = "100px",
  threshold: number = 0.1,
  triggerOnce: boolean = true
): LazyLoadConfig {
  return { rootMargin, threshold, triggerOnce };
}

// Global lazy load manager
let globalLazyLoadManager: LazyLoadManager | null = null;

export function getGlobalLazyLoadManager(): LazyLoadManager {
  if (!globalLazyLoadManager) {
    globalLazyLoadManager = createLazyLoadManager();
  }
  return globalLazyLoadManager;
}

export function setGlobalLazyLoadManager(manager: LazyLoadManager): void {
  globalLazyLoadManager = manager;
}

// Convenience functions
export function registerLazyLoad(name: string, config: LazyLoadConfig): void {
  getGlobalLazyLoadManager().register(name, config);
}

export function observeLazyLoad(name: string, element: Element, onVisible: () => void): void {
  getGlobalLazyLoadManager().observe(name, element, onVisible);
}

export function getLazyLoadState(name: string): LazyLoadState | undefined {
  return getGlobalLazyLoadManager().getState(name);
}

export function unregisterLazyLoad(name: string): void {
  getGlobalLazyLoadManager().unregister(name);
}

export function clearLazyLoad(): void {
  getGlobalLazyLoadManager().clear();
}

// Simple lazy load helper
export function lazyLoad(
  element: Element,
  callback: () => void,
  options?: { rootMargin?: string; threshold?: number }
): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
          observer.unobserve(element);
        }
      });
    },
    {
      rootMargin: options?.rootMargin ?? "100px",
      threshold: options?.threshold ?? 0.1,
    }
  );

  observer.observe(element);
  return () => observer.disconnect();
}
