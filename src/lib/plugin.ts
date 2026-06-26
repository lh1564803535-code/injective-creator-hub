/**
 * Plugin utilities
 */

interface Plugin {
  name: string;
  version: string;
  description?: string;
  install: (app: PluginApp) => void;
  uninstall?: (app: PluginApp) => void;
}

interface PluginApp {
  use(plugin: Plugin): void;
  unuse(plugin: Plugin): void;
  has(plugin: Plugin): boolean;
  getPlugins(): Plugin[];
}

class PluginManager implements PluginApp {
  private plugins: Map<string, Plugin> = new Map();
  private installed: Set<string> = new Set();

  use(plugin: Plugin): void {
    if (this.installed.has(plugin.name)) {
      console.warn(`Plugin "${plugin.name}" is already installed`);
      return;
    }

    this.plugins.set(plugin.name, plugin);
    plugin.install(this);
    this.installed.add(plugin.name);
  }

  unuse(plugin: Plugin): void {
    if (!this.installed.has(plugin.name)) {
      console.warn(`Plugin "${plugin.name}" is not installed`);
      return;
    }

    if (plugin.uninstall) {
      plugin.uninstall(this);
    }
    this.installed.delete(plugin.name);
    this.plugins.delete(plugin.name);
  }

  has(plugin: Plugin): boolean {
    return this.installed.has(plugin.name);
  }

  getPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  getInstalled(): string[] {
    return Array.from(this.installed);
  }

  isInstalled(name: string): boolean {
    return this.installed.has(name);
  }

  clear(): void {
    // Uninstall all plugins in reverse order
    const plugins = Array.from(this.plugins.values()).reverse();
    plugins.forEach((plugin) => this.unuse(plugin));
  }
}

export function createPluginManager(): PluginManager {
  return new PluginManager();
}

export function createPlugin(
  name: string,
  version: string,
  install: (app: PluginApp) => void,
  uninstall?: (app: PluginApp) => void,
  description?: string
): Plugin {
  return { name, version, install, uninstall, description };
}

// Plugin hooks
interface PluginHooks {
  onInit?: () => void;
  onDestroy?: () => void;
  onBeforeRender?: () => void;
  onAfterRender?: () => void;
  onError?: (error: Error) => void;
}

class HookManager {
  private hooks: Map<string, Set<(...args: unknown[]) => void>> = new Map();

  register(hook: string, handler: (...args: unknown[]) => void): () => void {
    if (!this.hooks.has(hook)) {
      this.hooks.set(hook, new Set());
    }
    this.hooks.get(hook)!.add(handler);
    return () => this.hooks.get(hook)?.delete(handler);
  }

  async execute(hook: string, ...args: unknown[]): Promise<void> {
    const handlers = this.hooks.get(hook);
    if (handlers) {
      for (const handler of handlers) {
        try {
          await handler(...args);
        } catch (error) {
          console.error(`Error in hook "${hook}":`, error);
        }
      }
    }
  }

  has(hook: string): boolean {
    return this.hooks.has(hook) && this.hooks.get(hook)!.size > 0;
  }

  clear(): void {
    this.hooks.clear();
  }
}

export function createHookManager(): HookManager {
  return new HookManager();
}

// Extension point
interface ExtensionPoint<T> {
  name: string;
  extensions: T[];
  register(extension: T): void;
  unregister(extension: T): void;
  getAll(): T[];
}

export function createExtensionPoint<T>(name: string): ExtensionPoint<T> {
  const extensions: T[] = [];

  return {
    name,
    extensions,
    register(extension: T) {
      extensions.push(extension);
    },
    unregister(extension: T) {
      const index = extensions.indexOf(extension);
      if (index > -1) {
        extensions.splice(index, 1);
      }
    },
    getAll() {
      return [...extensions];
    },
  };
}
