/**
 * Fixture utilities
 */

type FixtureFactory<T> = () => T;
type FixtureFactoryAsync<T> = () => Promise<T>;

class FixtureManager {
  private fixtures: Map<string, unknown> = new Map();
  private factories: Map<string, FixtureFactory<unknown>> = new Map();

  register<T>(name: string, factory: FixtureFactory<T>): void {
    this.factories.set(name, factory as FixtureFactory<unknown>);
  }

  get<T>(name: string): T {
    if (!this.fixtures.has(name)) {
      const factory = this.factories.get(name);
      if (!factory) {
        throw new Error(`Fixture "${name}" not found`);
      }
      this.fixtures.set(name, factory());
    }
    return this.fixtures.get(name) as T;
  }

  create<T>(name: string): T {
    const factory = this.factories.get(name);
    if (!factory) {
      throw new Error(`Fixture "${name}" not found`);
    }
    return factory() as T;
  }

  clear(): void {
    this.fixtures.clear();
  }

  clearFactories(): void {
    this.factories.clear();
    this.fixtures.clear();
  }

  getNames(): string[] {
    return Array.from(this.factories.keys());
  }
}

export function createFixtureManager(): FixtureManager {
  return new FixtureManager();
}

// Global fixture manager
let globalFixtureManager: FixtureManager | null = null;

export function getGlobalFixtureManager(): FixtureManager {
  if (!globalFixtureManager) {
    globalFixtureManager = createFixtureManager();
  }
  return globalFixtureManager;
}

export function setGlobalFixtureManager(manager: FixtureManager): void {
  globalFixtureManager = manager;
}

// Convenience functions
export function registerFixture<T>(name: string, factory: FixtureFactory<T>): void {
  getGlobalFixtureManager().register(name, factory);
}

export function getFixture<T>(name: string): T {
  return getGlobalFixtureManager().get<T>(name);
}

export function createFixture<T>(name: string): T {
  return getGlobalFixtureManager().create<T>(name);
}

export function clearFixtures(): void {
  getGlobalFixtureManager().clear();
}

// Pre-defined fixtures
export function registerUserFixtures(): void {
  const manager = getGlobalFixtureManager();

  manager.register("user", () => ({
    address: "0x" + "1".repeat(40),
    balance: 1000,
    rank: 1,
    earnings: 5000,
  }));

  manager.register("user-with-earnings", () => ({
    address: "0x" + "2".repeat(40),
    balance: 5000,
    rank: 5,
    earnings: 25000,
  }));
}

export function registerCampaignFixtures(): void {
  const manager = getGlobalFixtureManager();

  manager.register("campaign", () => ({
    id: 1,
    title: "Test Campaign",
    description: "A test campaign",
    totalReward: BigInt(1000) * BigInt(10 ** 6),
    deadline: Date.now() + 7 * 24 * 60 * 60 * 1000,
    submissionCount: 10,
    settled: false,
  }));

  manager.register("campaign-settled", () => ({
    id: 2,
    title: "Settled Campaign",
    description: "A settled campaign",
    totalReward: BigInt(5000) * BigInt(10 ** 6),
    deadline: Date.now() - 7 * 24 * 60 * 60 * 1000,
    submissionCount: 50,
    settled: true,
  }));
}
