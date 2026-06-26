/**
 * Transformer utilities
 */

type Transformer<TInput, TOutput> = (input: TInput) => TOutput;

export function createTransformer<TInput, TOutput>(
  fn: (input: TInput) => TOutput
): Transformer<TInput, TOutput> {
  return fn;
}

export function composeTransformers<TInput, TIntermediate, TOutput>(
  first: Transformer<TInput, TIntermediate>,
  second: Transformer<TIntermediate, TOutput>
): Transformer<TInput, TOutput> {
  return (input: TInput) => second(first(input));
}

export function pipeTransformers<T>(...transformers: Transformer<T, T>[]): Transformer<T, T> {
  return (input: T) => transformers.reduce((acc, fn) => fn(acc), input);
}

export function conditionalTransformer<T>(
  condition: (input: T) => boolean,
  trueTransformer: Transformer<T, T>,
  falseTransformer?: Transformer<T, T>
): Transformer<T, T> {
  return (input: T) => {
    if (condition(input)) {
      return trueTransformer(input);
    }
    return falseTransformer ? falseTransformer(input) : input;
  };
}

export function tapTransformer<T>(fn: (input: T) => void): Transformer<T, T> {
  return (input: T) => {
    fn(input);
    return input;
  };
}

// String transformers
export function createUpperCaseTransformer(): Transformer<string, string> {
  return (input) => input.toUpperCase();
}

export function createLowerCaseTransformer(): Transformer<string, string> {
  return (input) => input.toLowerCase();
}

export function createTrimTransformer(): Transformer<string, string> {
  return (input) => input.trim();
}

export function createReplaceTransformer(
  search: string,
  replacement: string
): Transformer<string, string> {
  return (input) => input.replace(new RegExp(search, "g"), replacement);
}

export function createTruncateTransformer(maxLength: number): Transformer<string, string> {
  return (input) => (input.length > maxLength ? input.slice(0, maxLength) + "..." : input);
}

// Number transformers
export function createRoundTransformer(decimals: number = 0): Transformer<number, number> {
  return (input) => {
    const factor = Math.pow(10, decimals);
    return Math.round(input * factor) / factor;
  };
}

export function createClampTransformer(min: number, max: number): Transformer<number, number> {
  return (input) => Math.min(Math.max(input, min), max);
}

export function createScaleTransformer(
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): Transformer<number, number> {
  return (input) => {
    const normalized = (input - fromMin) / (fromMax - fromMin);
    return toMin + normalized * (toMax - toMin);
  };
}

// Array transformers
export function createFlattenTransformer<T>(): Transformer<T[][], T[]> {
  return (input) => input.flat();
}

export function createUniqueTransformer<T>(): Transformer<T[], T[]> {
  return (input) => [...new Set(input)];
}

export function createSortTransformer<T>(
  compareFn: (a: T, b: T) => number
): Transformer<T[], T[]> {
  return (input) => [...input].sort(compareFn);
}

export function createFilterTransformer<T>(
  predicate: (item: T) => boolean
): Transformer<T[], T[]> {
  return (input) => input.filter(predicate);
}

export function createMapTransformer<T, U>(
  fn: (item: T) => U
): Transformer<T[], U[]> {
  return (input) => input.map(fn);
}

// Object transformers
export function createPickTransformer<T extends object, K extends keyof T>(
  keys: K[]
): Transformer<T, Pick<T, K>> {
  return (input) => {
    const result = {} as Pick<T, K>;
    keys.forEach((key) => {
      if (key in input) {
        result[key] = input[key];
      }
    });
    return result;
  };
}

export function createOmitTransformer<T extends object, K extends keyof T>(
  keys: K[]
): Transformer<T, Omit<T, K>> {
  return (input) => {
    const result = { ...input };
    keys.forEach((key) => delete result[key]);
    return result as Omit<T, K>;
  };
}

export function createRenameTransformer<T extends object>(
  mapping: Record<string, string>
): Transformer<T, T> {
  return (input) => {
    const result = { ...input };
    Object.entries(mapping).forEach(([oldKey, newKey]) => {
      if (oldKey in result) {
        (result as Record<string, unknown>)[newKey] = result[oldKey as keyof T];
        delete result[oldKey as keyof T];
      }
    });
    return result;
  };
}
