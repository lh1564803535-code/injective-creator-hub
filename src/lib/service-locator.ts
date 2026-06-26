/**
 * Service Locator utilities
 */

class ServiceLocator {
  private services: Map<string, unknown> = new Map();
  private factories: Map<string, () => unknown> = new Map();
  private singletons: Map<string, unknown> = new Map();

  register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }

  registerFactory<T>(name: string, factory: () => T): void {
    this.factories.set(name, factory);
  }

  registerSingleton<T>(name: string, factory: () => T): void {
    this.factories.set(name, factory);
    // Mark as singleton by storing undefined initially
    this.singletons.set(name, undefined);
  }

  resolve<T>(name: string): T {
    // Check direct registrations first
    if (this.services.has(name)) {
      return this.services.get(name) as T;
    }

    // Check singletons
    if (this.singletons.has(name)) {
      const singleton = this.singletons.get(name);
      if (singleton === undefined) {
        // First access - create singleton
        const factory = this.factories.get(name);
        if (!factory) {
          throw new Error(`No service or factory registered for "${name}"`);
        }
        const instance = factory();
        this.singletons.set(name, instance);
        return instance as T;
      }
      return singleton as T;
    }

    // Check factories
    if (this.factories.has(name)) {
      const factory = this.factories.get(name)!;
      return factory() as T;
    }

    throw new Error(`No service registered for "${name}"`);
  }

  has(name: string): boolean {
    return (
      this.services.has(name) ||
      this.factories.has(name) ||
      this.singletons.has(name)
    );
  }

  remove(name: string): void {
    this.services.delete(name);
    this.factories.delete(name);
    this.singletons.delete(name);
  }

  clear(): void {
    this.services.clear();
    this.factories.clear();
    this.singletons.clear();
  }

  getRegisteredServices(): string[] {
    return Array.from(this.services.keys());
  }

  getRegisteredFactories(): string[] {
    return Array.from(this.factories.keys());
  }

  getRegisteredSingletons(): string[] {
    return Array.from(this.singletons.keys());
  }

  getAllRegistered(): string[] {
    return [
      ...new Set([
        ...this.getRegisteredServices(),
        ...this.getRegisteredFactories(),
        ...this.getRegisteredSingletons(),
      ]),
    ];
  }
}

export function createServiceLocator(): ServiceLocator {
  return new ServiceLocator();
}

// Global service locator
let globalLocator: ServiceLocator | null = null;

export function getGlobalServiceLocator(): ServiceLocator {
  if (!globalLocator) {
    globalLocator = createServiceLocator();
  }
  return globalLocator;
}

export function setGlobalServiceLocator(locator: ServiceLocator): void {
  globalLocator = locator;
}

// Convenience functions using global locator
export function registerService<T>(name: string, service: T): void {
  getGlobalServiceLocator().register(name, service);
}

export function resolveService<T>(name: string): T {
  return getGlobalServiceLocator().resolve<T>(name);
}

export function hasService(name: string): boolean {
  return getGlobalServiceLocator().has(name);
}

// Service decorator
export function service(name: string) {
  return function (target: unknown, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: () => resolveService(name),
      enumerable: true,
      configurable: true,
    });
  };
}
