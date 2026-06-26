/**
 * Pagination utilities
 */

interface PaginationConfig {
  page: number;
  pageSize: number;
  totalItems: number;
}

interface PaginationResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

class PaginationManager {
  private configs: Map<string, PaginationConfig> = new Map();

  setConfig(name: string, config: PaginationConfig): void {
    this.configs.set(name, config);
  }

  getConfig(name: string): PaginationConfig | undefined {
    return this.configs.get(name);
  }

  removeConfig(name: string): void {
    this.configs.delete(name);
  }

  apply<T>(data: T[], configName: string): PaginationResult<T> {
    const config = this.configs.get(configName);
    if (!config) {
      return {
        items: data,
        page: 1,
        pageSize: data.length,
        totalItems: data.length,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      };
    }

    const { page, pageSize } = config;
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = data.slice(startIndex, endIndex);

    return {
      items,
      page,
      pageSize,
      totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  clear(): void {
    this.configs.clear();
  }
}

export function createPaginationManager(): PaginationManager {
  return new PaginationManager();
}

export function createPaginationConfig(
  page: number = 1,
  pageSize: number = 10,
  totalItems: number = 0
): PaginationConfig {
  return { page, pageSize, totalItems };
}

// Global pagination manager
let globalPaginationManager: PaginationManager | null = null;

export function getGlobalPaginationManager(): PaginationManager {
  if (!globalPaginationManager) {
    globalPaginationManager = createPaginationManager();
  }
  return globalPaginationManager;
}

export function setGlobalPaginationManager(manager: PaginationManager): void {
  globalPaginationManager = manager;
}

// Convenience functions
export function setPagination(name: string, config: PaginationConfig): void {
  getGlobalPaginationManager().setConfig(name, config);
}

export function paginate<T>(data: T[], configName: string): PaginationResult<T> {
  return getGlobalPaginationManager().apply(data, configName);
}

export function removePagination(name: string): void {
  getGlobalPaginationManager().removeConfig(name);
}

// Quick pagination function
export function paginateData<T>(
  data: T[],
  page: number = 1,
  pageSize: number = 10
): PaginationResult<T> {
  const manager = createPaginationManager();
  manager.setConfig("temp", createPaginationConfig(page, pageSize, data.length));
  return manager.apply(data, "temp");
}

// Helper functions
export function getPageRange(currentPage: number, totalPages: number, maxVisible: number = 5): number[] {
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function getTotalPages(totalItems: number, pageSize: number): number {
  return Math.ceil(totalItems / pageSize);
}

export function getOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

export function getCurrentPage(offset: number, pageSize: number): number {
  return Math.floor(offset / pageSize) + 1;
}
