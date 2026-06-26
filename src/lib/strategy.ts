/**
 * Strategy pattern utilities
 */

interface Strategy<TInput, TOutput> {
  execute(input: TInput): TOutput;
}

class StrategyContext<TInput, TOutput> {
  private strategy: Strategy<TInput, TOutput>;

  constructor(strategy: Strategy<TInput, TOutput>) {
    this.strategy = strategy;
  }

  setStrategy(strategy: Strategy<TInput, TOutput>): void {
    this.strategy = strategy;
  }

  execute(input: TInput): TOutput {
    return this.strategy.execute(input);
  }
}

export function createStrategy<TInput, TOutput>(
  execute: (input: TInput) => TOutput
): Strategy<TInput, TOutput> {
  return { execute };
}

export function createStrategyContext<TInput, TOutput>(
  strategy: Strategy<TInput, TOutput>
): StrategyContext<TInput, TOutput> {
  return new StrategyContext(strategy);
}

// Sorting strategies
export function createSortStrategy<T>(
  compareFn: (a: T, b: T) => number
): Strategy<T[], T[]> {
  return createStrategy((items: T[]) => [...items].sort(compareFn));
}

export function createNumberSortStrategy(
  direction: "asc" | "desc" = "asc"
): Strategy<number[], number[]> {
  return createSortStrategy((a, b) =>
    direction === "asc" ? a - b : b - a
  );
}

export function createDateSortStrategy(
  direction: "asc" | "desc" = "desc"
): Strategy<Date[], Date[]> {
  return createSortStrategy((a, b) =>
    direction === "asc" ? a.getTime() - b.getTime() : b.getTime() - a.getTime()
  );
}

// Filtering strategies
export function createFilterStrategy<T>(
  predicate: (item: T) => boolean
): Strategy<T[], T[]> {
  return createStrategy((items: T[]) => items.filter(predicate));
}

// Validation strategies
export function createValidationStrategy<T>(
  validator: (value: T) => boolean,
  errorMessage: string
): Strategy<T, { valid: boolean; error?: string }> {
  return createStrategy((value: T) => {
    const valid = validator(value);
    return { valid, error: valid ? undefined : errorMessage };
  });
}

// Formatting strategies
export function createFormatStrategy<T>(
  formatter: (value: T) => string
): Strategy<T, string> {
  return createStrategy(formatter);
}

export function createNumberFormatStrategy(
  decimals: number = 2
): Strategy<number, string> {
  return createFormatStrategy((value: number) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  );
}

export function createCurrencyFormatStrategy(
  currency: string = "USD"
): Strategy<number, string> {
  return createFormatStrategy((value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value)
  );
}

export function createPercentageFormatStrategy(
  decimals: number = 2
): Strategy<number, string> {
  return createFormatStrategy((value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value / 100)
  );
}
