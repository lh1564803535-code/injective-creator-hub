/**
 * Setup utilities
 */

type SetupFn = () => void | Promise<void>;
type TeardownFn = () => void | Promise<void>;

class SetupManager {
  private setups: Map<string, SetupFn> = new Map();
  private teardowns: Map<string, TeardownFn> = new Map();
  private executed: Set<string> = new Set();

  register(name: string, setup: SetupFn, teardown?: TeardownFn): void {
    this.setups.set(name, setup);
    if (teardown) {
      this.teardowns.set(name, teardown);
    }
  }

  async execute(name: string): Promise<void> {
    const setup = this.setups.get(name);
    if (!setup) {
      throw new Error(`Setup "${name}" not found`);
    }

    await setup();
    this.executed.add(name);
  }

  async executeAll(): Promise<void> {
    for (const name of this.setups.keys()) {
      if (!this.executed.has(name)) {
        await this.execute(name);
      }
    }
  }

  async teardown(name: string): Promise<void> {
    const teardown = this.teardowns.get(name);
    if (teardown) {
      await teardown();
    }
    this.executed.delete(name);
  }

  async teardownAll(): Promise<void> {
    for (const name of [...this.executed].reverse()) {
      await this.teardown(name);
    }
  }

  isExecuted(name: string): boolean {
    return this.executed.has(name);
  }

  getNames(): string[] {
    return Array.from(this.setups.keys());
  }

  clear(): void {
    this.setups.clear();
    this.teardowns.clear();
    this.executed.clear();
  }
}

export function createSetupManager(): SetupManager {
  return new SetupManager();
}

// Global setup manager
let globalSetupManager: SetupManager | null = null;

export function getGlobalSetupManager(): SetupManager {
  if (!globalSetupManager) {
    globalSetupManager = createSetupManager();
  }
  return globalSetupManager;
}

export function setGlobalSetupManager(manager: SetupManager): void {
  globalSetupManager = manager;
}

// Convenience functions
export function registerSetup(name: string, setup: SetupFn, teardown?: TeardownFn): void {
  getGlobalSetupManager().register(name, setup, teardown);
}

export async function executeSetup(name: string): Promise<void> {
  return getGlobalSetupManager().execute(name);
}

export async function executeAllSetups(): Promise<void> {
  return getGlobalSetupManager().executeAll();
}

export async function teardownSetup(name: string): Promise<void> {
  return getGlobalSetupManager().teardown(name);
}

export async function teardownAllSetups(): Promise<void> {
  return getGlobalSetupManager().teardownAll();
}

export function isSetupExecuted(name: string): boolean {
  return getGlobalSetupManager().isExecuted(name);
}

// Common setups
export function registerCommonSetups(): void {
  const manager = getGlobalSetupManager();

  manager.register("locale-storage", () => {
    // Initialize localStorage if needed
  });

  manager.register("theme", () => {
    // Apply saved theme
    const theme = localStorage.getItem("theme") || "dark";
    document.documentElement.classList.toggle("dark", theme === "dark");
  });

  manager.register("analytics", () => {
    // Initialize analytics
  });
}
