/**
 * Module utilities
 */

interface Module {
  name: string;
  version: string;
  description?: string;
  dependencies?: string[];
  init: (app: ModuleApp) => Promise<void>;
  destroy?: (app: ModuleApp) => Promise<void>;
}

interface ModuleApp {
  register(module: Module): Promise<void>;
  unregister(module: Module): Promise<void>;
  has(name: string): boolean;
  get(name: string): Module | undefined;
  getModules(): Module[];
}

class ModuleManager implements ModuleApp {
  private modules: Map<string, Module> = new Map();
  private initialized: Set<string> = new Set();

  async register(module: Module): Promise<void> {
    if (this.modules.has(module.name)) {
      console.warn(`Module "${module.name}" is already registered`);
      return;
    }

    // Check dependencies
    if (module.dependencies) {
      for (const dep of module.dependencies) {
        if (!this.modules.has(dep)) {
          throw new Error(`Module "${module.name}" depends on "${dep}" which is not registered`);
        }
      }
    }

    this.modules.set(module.name, module);
    await module.init(this);
    this.initialized.add(module.name);
  }

  async unregister(module: Module): Promise<void> {
    if (!this.modules.has(module.name)) {
      console.warn(`Module "${module.name}" is not registered`);
      return;
    }

    // Check if other modules depend on this one
    for (const [name, mod] of this.modules) {
      if (name !== module.name && mod.dependencies?.includes(module.name)) {
        throw new Error(`Cannot unregister "${module.name}" because "${name}" depends on it`);
      }
    }

    if (module.destroy) {
      await module.destroy(this);
    }

    this.initialized.delete(module.name);
    this.modules.delete(module.name);
  }

  has(name: string): boolean {
    return this.modules.has(name);
  }

  get(name: string): Module | undefined {
    return this.modules.get(name);
  }

  getModules(): Module[] {
    return Array.from(this.modules.values());
  }

  isInitialized(name: string): boolean {
    return this.initialized.has(name);
  }

  getDependencyGraph(): Map<string, string[]> {
    const graph = new Map<string, string[]>();
    for (const [name, module] of this.modules) {
      graph.set(name, module.dependencies || []);
    }
    return graph;
  }

  getInitializationOrder(): string[] {
    const order: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (name: string) => {
      if (visited.has(name)) return;
      if (visiting.has(name)) {
        throw new Error(`Circular dependency detected: ${name}`);
      }

      visiting.add(name);
      const module = this.modules.get(name);
      if (module?.dependencies) {
        for (const dep of module.dependencies) {
          visit(dep);
        }
      }
      visiting.delete(name);
      visited.add(name);
      order.push(name);
    };

    for (const name of this.modules.keys()) {
      visit(name);
    }

    return order;
  }

  async clear(): Promise<void> {
    const modules = Array.from(this.modules.values()).reverse();
    for (const module of modules) {
      await this.unregister(module);
    }
  }
}

export function createModuleManager(): ModuleManager {
  return new ModuleManager();
}

export function createModule(
  name: string,
  version: string,
  init: (app: ModuleApp) => Promise<void>,
  options?: {
    description?: string;
    dependencies?: string[];
    destroy?: (app: ModuleApp) => Promise<void>;
  }
): Module {
  return {
    name,
    version,
    init,
    ...options,
  };
}
