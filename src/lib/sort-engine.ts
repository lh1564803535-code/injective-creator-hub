/**
 * Sort Engine utilities
 */

interface SortConfig {
  field: string;
  direction: "asc" | "desc";
  nullsFirst?: boolean;
  caseSensitive?: boolean;
}

class SortEngine {
  private sorts: Map<string, SortConfig[]> = new Map();

  setSort(name: string, config: SortConfig[]): void {
    this.sorts.set(name, config);
  }

  getSort(name: string): SortConfig[] | undefined {
    return this.sorts.get(name);
  }

  removeSort(name: string): void {
    this.sorts.delete(name);
  }

  apply<T>(data: T[], sortName: string): T[] {
    const config = this.sorts.get(sortName);
    if (!config) return data;

    return [...data].sort((a, b) => this.compareItems(a, b, config));
  }

  private compareItems<T>(a: T, b: T, config: SortConfig[]): number {
    for (const sort of config) {
      const aValue = (a as Record<string, unknown>)[sort.field];
      const bValue = (b as Record<string, unknown>)[sort.field];

      // Handle nulls
      if (aValue == null && bValue == null) continue;
      if (aValue == null) return sort.nullsFirst ? -1 : 1;
      if (bValue == null) return sort.nullsFirst ? 1 : -1;

      let comparison = 0;

      if (typeof aValue === "string" && typeof bValue === "string") {
        const aStr = sort.caseSensitive ? aValue : aValue.toLowerCase();
        const bStr = sort.caseSensitive ? bValue : bValue.toLowerCase();
        comparison = aStr.localeCompare(bStr);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        comparison = (aValue === bValue) ? 0 : aValue ? 1 : -1;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      if (comparison !== 0) {
        return sort.direction === "asc" ? comparison : -comparison;
      }
    }

    return 0;
  }

  clear(): void {
    this.sorts.clear();
  }
}

export function createSortEngine(): SortEngine {
  return new SortEngine();
}

export function createSortConfig(
  field: string,
  direction: "asc" | "desc" = "asc",
  options?: Partial<Omit<SortConfig, "field" | "direction">>
): SortConfig {
  return {
    field,
    direction,
    ...options,
  };
}

// Common sort presets
export function createNameSort(direction: "asc" | "desc" = "asc"): SortConfig {
  return createSortConfig("name", direction, { caseSensitive: false });
}

export function createDateSort(direction: "asc" | "desc" = "desc"): SortConfig {
  return createSortConfig("timestamp", direction);
}

export function createEarningsSort(direction: "asc" | "desc" = "desc"): SortConfig {
  return createSortConfig("earnings", direction);
}

export function createRankSort(direction: "asc" | "desc" = "asc"): SortConfig {
  return createSortConfig("rank", direction);
}

// Global sort engine
let globalSortEngine: SortEngine | null = null;

export function getGlobalSortEngine(): SortEngine {
  if (!globalSortEngine) {
    globalSortEngine = createSortEngine();
  }
  return globalSortEngine;
}

export function setGlobalSortEngine(engine: SortEngine): void {
  globalSortEngine = engine;
}

// Convenience functions
export function setSort(name: string, config: SortConfig[]): void {
  getGlobalSortEngine().setSort(name, config);
}

export function applySort<T>(data: T[], sortName: string): T[] {
  return getGlobalSortEngine().apply(data, sortName);
}

export function removeSort(name: string): void {
  getGlobalSortEngine().removeSort(name);
}

export function clearSorts(): void {
  getGlobalSortEngine().clear();
}

// Quick sort function
export function sortData<T>(
  data: T[],
  config: SortConfig | SortConfig[]
): T[] {
  const sortEngine = createSortEngine();
  const configArray = Array.isArray(config) ? config : [config];
  sortEngine.setSort("temp", configArray);
  return sortEngine.apply(data, "temp");
}
