/**
 * Infinite Scroll utilities
 */

interface InfiniteScrollConfig {
  threshold: number; // pixels from bottom to trigger load
  pageSize: number;
  initialPage: number;
}

interface InfiniteScrollState {
  page: number;
  loading: boolean;
  hasMore: boolean;
  items: unknown[];
}

class InfiniteScrollManager {
  private states: Map<string, InfiniteScrollState> = new Map();
  private configs: Map<string, InfiniteScrollConfig> = new Map();
  private loaders: Map<string, (page: number) => Promise<unknown[]>> = new Map();

  register(
    name: string,
    config: InfiniteScrollConfig,
    loader: (page: number) => Promise<unknown[]>
  ): void {
    this.configs.set(name, config);
    this.loaders.set(name, loader);
    this.states.set(name, {
      page: config.initialPage,
      loading: false,
      hasMore: true,
      items: [],
    });
  }

  unregister(name: string): void {
    this.configs.delete(name);
    this.loaders.delete(name);
    this.states.delete(name);
  }

  async loadMore(name: string): Promise<void> {
    const state = this.states.get(name);
    const loader = this.loaders.get(name);

    if (!state || !loader || state.loading || !state.hasMore) return;

    state.loading = true;

    try {
      const newItems = await loader(state.page);
      if (newItems.length === 0) {
        state.hasMore = false;
      } else {
        state.items = [...state.items, ...newItems];
        state.page++;
      }
    } catch (error) {
      console.error(`Error loading page ${state.page} for "${name}":`, error);
    } finally {
      state.loading = false;
    }
  }

  getState(name: string): InfiniteScrollState | undefined {
    return this.states.get(name);
  }

  reset(name: string): void {
    const config = this.configs.get(name);
    const state = this.states.get(name);

    if (config && state) {
      state.page = config.initialPage;
      state.loading = false;
      state.hasMore = true;
      state.items = [];
    }
  }

  clear(): void {
    this.states.clear();
    this.configs.clear();
    this.loaders.clear();
  }
}

export function createInfiniteScrollManager(): InfiniteScrollManager {
  return new InfiniteScrollManager();
}

export function createInfiniteScrollConfig(
  pageSize: number = 10,
  threshold: number = 200,
  initialPage: number = 1
): InfiniteScrollConfig {
  return { threshold, pageSize, initialPage };
}

// Global infinite scroll manager
let globalInfiniteScrollManager: InfiniteScrollManager | null = null;

export function getGlobalInfiniteScrollManager(): InfiniteScrollManager {
  if (!globalInfiniteScrollManager) {
    globalInfiniteScrollManager = createInfiniteScrollManager();
  }
  return globalInfiniteScrollManager;
}

export function setGlobalInfiniteScrollManager(manager: InfiniteScrollManager): void {
  globalInfiniteScrollManager = manager;
}

// Convenience functions
export function registerInfiniteScroll(
  name: string,
  config: InfiniteScrollConfig,
  loader: (page: number) => Promise<unknown[]>
): void {
  getGlobalInfiniteScrollManager().register(name, config, loader);
}

export function loadMore(name: string): Promise<void> {
  return getGlobalInfiniteScrollManager().loadMore(name);
}

export function getInfiniteScrollState(name: string): InfiniteScrollState | undefined {
  return getGlobalInfiniteScrollManager().getState(name);
}

export function resetInfiniteScroll(name: string): void {
  getGlobalInfiniteScrollManager().reset(name);
}

export function unregisterInfiniteScroll(name: string): void {
  getGlobalInfiniteScrollManager().unregister(name);
}

// Scroll detection helper
export function isNearBottom(
  element: HTMLElement,
  threshold: number = 200
): boolean {
  const { scrollTop, scrollHeight, clientHeight } = element;
  return scrollHeight - scrollTop - clientHeight < threshold;
}

// Debounced scroll handler
export function createScrollHandler(
  callback: () => void,
  delay: number = 100
): (event: Event) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (event: Event) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      callback();
      timeoutId = null;
    }, delay);
  };
}
