/**
 * Factory pattern utilities
 */

interface Factory<T, TConfig = void> {
  create(config: TConfig): T;
}

class Registry<T, TConfig = void> {
  private factories: Map<string, Factory<T, TConfig>> = new Map();

  register(name: string, factory: Factory<T, TConfig>): void {
    this.factories.set(name, factory);
  }

  unregister(name: string): boolean {
    return this.factories.delete(name);
  }

  create(name: string, config: TConfig): T {
    const factory = this.factories.get(name);
    if (!factory) {
      throw new Error(`Factory "${name}" not found`);
    }
    return factory.create(config);
  }

  has(name: string): boolean {
    return this.factories.has(name);
  }

  getNames(): string[] {
    return Array.from(this.factories.keys());
  }

  clear(): void {
    this.factories.clear();
  }
}

export function createFactory<T, TConfig = void>(
  createFn: (config: TConfig) => T
): Factory<T, TConfig> {
  return { create: createFn };
}

export function createRegistry<T, TConfig = void>(): Registry<T, TConfig> {
  return new Registry<T, TConfig>();
}

// Common factories
export function createObjectFactory<T extends Record<string, unknown>>(
  defaults: T
): Factory<T, Partial<T>> {
  return createFactory((overrides: Partial<T>) => ({
    ...defaults,
    ...overrides,
  }));
}

export function createArrayFactory<T>(
  itemFactory: Factory<T, void>,
  defaultSize: number = 10
): Factory<T[], { size?: number }> {
  return createFactory((config: { size?: number }) => {
    const size = config.size ?? defaultSize;
    return Array.from({ length: size }, () => itemFactory.create(undefined));
  });
}

export function createSingletonFactory<T>(
  createFn: () => T
): Factory<T, void> {
  let instance: T | null = null;

  return createFactory(() => {
    if (!instance) {
      instance = createFn();
    }
    return instance;
  });
}

export function createLazyFactory<T>(
  createFn: () => T
): Factory<T, void> {
  let instance: T | undefined;

  return createFactory(() => {
    if (instance === undefined) {
      instance = createFn();
    }
    return instance;
  });
}

export function createPoolFactory<T>(
  createFn: () => T,
  maxSize: number = 10
): Factory<T, void> & { release: (item: T) => void; getPoolSize: () => number } {
  const pool: T[] = [];

  const factory = createFactory(() => {
    if (pool.length > 0) {
      return pool.pop()!;
    }
    return createFn();
  });

  return Object.assign(factory, {
    release: (item: T) => {
      if (pool.length < maxSize) {
        pool.push(item);
      }
    },
    getPoolSize: () => pool.length,
  });
}
