/**
 * Virtual List utilities
 */

interface VirtualListConfig {
  itemHeight: number;
  containerHeight: number;
  overscan: number; // extra items to render above/below viewport
}

interface VirtualListState {
  startIndex: number;
  endIndex: number;
  visibleItems: unknown[];
  totalHeight: number;
  offsetY: number;
}

class VirtualListManager {
  private configs: Map<string, VirtualListConfig> = new Map();
  private data: Map<string, unknown[]> = new Map();

  setConfig(name: string, config: VirtualListConfig): void {
    this.configs.set(name, config);
  }

  setData(name: string, items: unknown[]): void {
    this.data.set(name, items);
  }

  getState(name: string, scrollTop: number): VirtualListState | undefined {
    const config = this.configs.get(name);
    const items = this.data.get(name);

    if (!config || !items) return undefined;

    const { itemHeight, containerHeight, overscan } = config;
    const totalItems = items.length;
    const totalHeight = totalItems * itemHeight;

    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const endIndex = Math.min(totalItems, startIndex + visibleCount + overscan * 2);

    const visibleItems = items.slice(startIndex, endIndex);
    const offsetY = startIndex * itemHeight;

    return {
      startIndex,
      endIndex,
      visibleItems,
      totalHeight,
      offsetY,
    };
  }

  getConfig(name: string): VirtualListConfig | undefined {
    return this.configs.get(name);
  }

  clear(): void {
    this.configs.clear();
    this.data.clear();
  }
}

export function createVirtualListManager(): VirtualListManager {
  return new VirtualListManager();
}

export function createVirtualListConfig(
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
): VirtualListConfig {
  return { itemHeight, containerHeight, overscan };
}

// Global virtual list manager
let globalVirtualListManager: VirtualListManager | null = null;

export function getGlobalVirtualListManager(): VirtualListManager {
  if (!globalVirtualListManager) {
    globalVirtualListManager = createVirtualListManager();
  }
  return globalVirtualListManager;
}

export function setGlobalVirtualListManager(manager: VirtualListManager): void {
  globalVirtualListManager = manager;
}

// Convenience functions
export function setVirtualListConfig(name: string, config: VirtualListConfig): void {
  getGlobalVirtualListManager().setConfig(name, config);
}

export function setVirtualListData(name: string, items: unknown[]): void {
  getGlobalVirtualListManager().setData(name, items);
}

export function getVirtualListState(name: string, scrollTop: number): VirtualListState | undefined {
  return getGlobalVirtualListManager().getState(name, scrollTop);
}

export function clearVirtualList(): void {
  getGlobalVirtualListManager().clear();
}

// Helper: Calculate visible range
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan: number = 5
): { startIndex: number; endIndex: number } {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(totalItems, startIndex + visibleCount + overscan * 2);

  return { startIndex, endIndex };
}

// Helper: Get item offset
export function getItemOffset(index: number, itemHeight: number): number {
  return index * itemHeight;
}

// Helper: Is item visible
export function isItemVisible(
  index: number,
  startIndex: number,
  endIndex: number
): boolean {
  return index >= startIndex && index < endIndex;
}
