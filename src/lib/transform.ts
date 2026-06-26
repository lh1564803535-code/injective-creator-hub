/**
 * Transform utilities
 */

type TransformFn<TInput, TOutput> = (input: TInput) => TOutput;

class TransformPipeline {
  private transforms: TransformFn<unknown, unknown>[] = [];

  add<TInput, TOutput>(transform: TransformFn<TInput, TOutput>): this {
    this.transforms.push(transform as TransformFn<unknown, unknown>);
    return this;
  }

  async execute<TInput, TOutput>(input: TInput): Promise<TOutput> {
    let result: unknown = input;

    for (const transform of this.transforms) {
      result = await transform(result);
    }

    return result as TOutput;
  }

  getLength(): number {
    return this.transforms.length;
  }

  clear(): void {
    this.transforms = [];
  }
}

export function createTransformPipeline(): TransformPipeline {
  return new TransformPipeline();
}

// Common transforms
export function mapTransform<TInput, TOutput>(fn: (input: TInput) => TOutput): TransformFn<TInput, TOutput> {
  return fn;
}

export function filterTransform<T>(predicate: (item: T) => boolean): TransformFn<T[], T[]> {
  return (input) => input.filter(predicate);
}

export function reduceTransform<T, U>(fn: (acc: U, item: T) => U, initial: U): TransformFn<T[], U> {
  return (input) => input.reduce(fn, initial);
}

export function sortTransform<T>(compareFn: (a: T, b: T) => number): TransformFn<T[], T[]> {
  return (input) => [...input].sort(compareFn);
}

export function uniqueTransform<T>(): TransformFn<T[], T[]> {
  return (input) => [...new Set(input)];
}

export function flattenTransform<T>(): TransformFn<T[][], T[]> {
  return (input) => input.flat();
}

export function chunkTransform<T>(size: number): TransformFn<T[], T[][]> {
  return (input) => {
    const chunks: T[][] = [];
    for (let i = 0; i < input.length; i += size) {
      chunks.push(input.slice(i, i + size));
    }
    return chunks;
  };
}

// Object transforms
export function pickTransform<T extends Record<string, unknown>, K extends keyof T>(
  keys: K[]
): TransformFn<T, Pick<T, K>> {
  return (input) => {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
      if (key in input) {
        result[key] = input[key];
      }
    }
    return result;
  };
}

export function omitTransform<T extends Record<string, unknown>, K extends keyof T>(
  keys: K[]
): TransformFn<T, Omit<T, K>> {
  return (input) => {
    const result = { ...input };
    for (const key of keys) {
      delete result[key];
    }
    return result as Omit<T, K>;
  };
}

export function renameTransform<T extends Record<string, unknown>>(
  mapping: Record<string, string>
): TransformFn<T, T> {
  return (input) => {
    const result = { ...input };
    for (const [oldKey, newKey] of Object.entries(mapping)) {
      if (oldKey in result) {
        (result as Record<string, unknown>)[newKey] = result[oldKey as keyof T];
        delete result[oldKey as keyof T];
      }
    }
    return result;
  };
}

// Compose transforms
export function compose<T>(...transforms: TransformFn<T, T>[]): TransformFn<T, T> {
  return (input) => {
    let result = input;
    for (const transform of transforms) {
      result = transform(result);
    }
    return result;
  };
}

export function pipe<T>(...transforms: TransformFn<T, T>[]): TransformFn<T, T> {
  return compose(...transforms);
}
