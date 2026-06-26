/**
 * Dependency Injection utilities
 */

class Container {
  private bindings: Map<string, Binding> = new Map();
  private singletons: Map<string, unknown> = new Map();

  bind<T>(key: string): BindingBuilder<T> {
    return new BindingBuilder<T>(this, key);
  }

  addBinding<T>(key: string, binding: Binding<T>): void {
    this.bindings.set(key, binding);
  }

  resolve<T>(key: string): T {
    const binding = this.bindings.get(key);
    if (!binding) {
      throw new Error(`No binding found for "${key}"`);
    }

    if (binding.scope === "singleton") {
      if (!this.singletons.has(key)) {
        this.singletons.set(key, binding.factory());
      }
      return this.singletons.get(key) as T;
    }

    return binding.factory() as T;
  }

  has(key: string): boolean {
    return this.bindings.has(key);
  }

  unbind(key: string): void {
    this.bindings.delete(key);
    this.singletons.delete(key);
  }

  clear(): void {
    this.bindings.clear();
    this.singletons.clear();
  }

  getBindingCount(): number {
    return this.bindings.size;
  }

  getKeys(): string[] {
    return Array.from(this.bindings.keys());
  }
}

interface Binding<T = unknown> {
  factory: () => T;
  scope: "transient" | "singleton";
}

class BindingBuilder<T> {
  constructor(
    private container: Container,
    private key: string
  ) {}

  to(factory: () => T): void {
    this.container.addBinding(this.key, {
      factory,
      scope: "transient",
    });
  }

  toSingleton(factory: () => T): void {
    this.container.addBinding(this.key, {
      factory,
      scope: "singleton",
    });
  }

  toValue(value: T): void {
    this.container.addBinding(this.key, {
      factory: () => value,
      scope: "singleton",
    });
  }
}

export function createContainer(): Container {
  return new Container();
}

// Decorator for auto-injection
export function inject(container: Container, key: string) {
  return function (target: unknown, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: () => container.resolve(key),
      enumerable: true,
      configurable: true,
    });
  };
}

// Service lifetime
export type ServiceLifetime = "transient" | "singleton" | "scoped";

// Service descriptor
interface ServiceDescriptor<T = unknown> {
  key: string;
  factory: () => T;
  lifetime: ServiceLifetime;
}

class ServiceCollection {
  private descriptors: ServiceDescriptor[] = [];

  add<T>(key: string, factory: () => T, lifetime: ServiceLifetime = "transient"): void {
    this.descriptors.push({ key, factory, lifetime });
  }

  addSingleton<T>(key: string, factory: () => T): void {
    this.add(key, factory, "singleton");
  }

  addTransient<T>(key: string, factory: () => T): void {
    this.add(key, factory, "transient");
  }

  addScoped<T>(key: string, factory: () => T): void {
    this.add(key, factory, "scoped");
  }

  build(): Container {
    const container = createContainer();

    for (const descriptor of this.descriptors) {
      if (descriptor.lifetime === "singleton") {
        container.bind(descriptor.key).toSingleton(descriptor.factory);
      } else {
        container.bind(descriptor.key).to(descriptor.factory);
      }
    }

    return container;
  }

  getDescriptors(): ServiceDescriptor[] {
    return [...this.descriptors];
  }
}

export function createServiceCollection(): ServiceCollection {
  return new ServiceCollection();
}

// Lazy resolution
export function lazy<T>(container: Container, key: string): () => T {
  let resolved: T | undefined;
  return () => {
    if (resolved === undefined) {
      resolved = container.resolve<T>(key);
    }
    return resolved;
  };
}

// Factory pattern with DI
export function createFactory<T>(
  container: Container,
  key: string
): () => T {
  return () => container.resolve<T>(key);
}
