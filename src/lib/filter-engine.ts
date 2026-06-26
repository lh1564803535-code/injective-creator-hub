/**
 * Filter Engine utilities
 */

interface FilterRule {
  field: string;
  operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains" | "startsWith" | "endsWith" | "in" | "nin";
  value: unknown;
}

interface FilterGroup {
  logic: "and" | "or";
  rules: Array<FilterRule | FilterGroup>;
}

class FilterEngine {
  private filters: Map<string, FilterGroup> = new Map();

  setFilter(name: string, filter: FilterGroup): void {
    this.filters.set(name, filter);
  }

  getFilter(name: string): FilterGroup | undefined {
    return this.filters.get(name);
  }

  removeFilter(name: string): void {
    this.filters.delete(name);
  }

  apply<T>(data: T[], filterName: string): T[] {
    const filter = this.filters.get(filterName);
    if (!filter) return data;

    return data.filter((item) => this.evaluateFilter(item, filter));
  }

  private evaluateFilter(item: unknown, filter: FilterGroup | FilterRule): boolean {
    if ("logic" in filter) {
      // It's a FilterGroup
      const group = filter as FilterGroup;
      if (group.logic === "and") {
        return group.rules.every((rule) => this.evaluateFilter(item, rule));
      } else {
        return group.rules.some((rule) => this.evaluateFilter(item, rule));
      }
    } else {
      // It's a FilterRule
      const rule = filter as FilterRule;
      const fieldValue = (item as Record<string, unknown>)[rule.field];
      return this.evaluateRule(fieldValue, rule);
    }
  }

  private evaluateRule(fieldValue: unknown, rule: FilterRule): boolean {
    switch (rule.operator) {
      case "eq":
        return fieldValue === rule.value;
      case "neq":
        return fieldValue !== rule.value;
      case "gt":
        return (fieldValue as number) > (rule.value as number);
      case "gte":
        return (fieldValue as number) >= (rule.value as number);
      case "lt":
        return (fieldValue as number) < (rule.value as number);
      case "lte":
        return (fieldValue as number) <= (rule.value as number);
      case "contains":
        return String(fieldValue).includes(String(rule.value));
      case "startsWith":
        return String(fieldValue).startsWith(String(rule.value));
      case "endsWith":
        return String(fieldValue).endsWith(String(rule.value));
      case "in":
        return Array.isArray(rule.value) && rule.value.includes(fieldValue);
      case "nin":
        return Array.isArray(rule.value) && !rule.value.includes(fieldValue);
      default:
        return false;
    }
  }

  clear(): void {
    this.filters.clear();
  }
}

export function createFilterEngine(): FilterEngine {
  return new FilterEngine();
}

export function createFilterRule(
  field: string,
  operator: FilterRule["operator"],
  value: unknown
): FilterRule {
  return { field, operator, value };
}

export function createFilterGroup(
  logic: "and" | "or",
  rules: Array<FilterRule | FilterGroup>
): FilterGroup {
  return { logic, rules };
}

// Common filter presets
export function createStatusFilter(status: string): FilterGroup {
  return createFilterGroup("and", [
    createFilterRule("status", "eq", status),
  ]);
}

export function createDateRangeFilter(from: number, to: number): FilterGroup {
  return createFilterGroup("and", [
    createFilterRule("timestamp", "gte", from),
    createFilterRule("timestamp", "lte", to),
  ]);
}

export function createSearchFilter(query: string, fields: string[]): FilterGroup {
  const rules = fields.map((field) =>
    createFilterRule(field, "contains", query)
  );
  return createFilterGroup("or", rules);
}

// Global filter engine
let globalFilterEngine: FilterEngine | null = null;

export function getGlobalFilterEngine(): FilterEngine {
  if (!globalFilterEngine) {
    globalFilterEngine = createFilterEngine();
  }
  return globalFilterEngine;
}

export function setGlobalFilterEngine(engine: FilterEngine): void {
  globalFilterEngine = engine;
}

// Convenience functions
export function setFilter(name: string, filter: FilterGroup): void {
  getGlobalFilterEngine().setFilter(name, filter);
}

export function applyFilter<T>(data: T[], filterName: string): T[] {
  return getGlobalFilterEngine().apply(data, filterName);
}

export function removeFilter(name: string): void {
  getGlobalFilterEngine().removeFilter(name);
}

export function clearFilters(): void {
  getGlobalFilterEngine().clear();
}
