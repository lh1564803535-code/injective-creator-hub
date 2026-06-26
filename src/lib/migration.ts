/**
 * Migration utilities
 */

interface Migration {
  version: string;
  name: string;
  up: (data: unknown) => Promise<unknown>;
  down: (data: unknown) => Promise<unknown>;
}

class MigrationManager {
  private migrations: Migration[] = [];
  private currentVersion: string = "0.0.0";

  addMigration(migration: Migration): void {
    this.migrations.push(migration);
    this.migrations.sort((a, b) => this.compareVersions(a.version, b.version));
  }

  async migrate(data: unknown, targetVersion?: string): Promise<unknown> {
    const target = targetVersion || this.getLatestVersion();
    let currentData = data;
    let currentVersion = this.currentVersion;

    for (const migration of this.migrations) {
      if (this.compareVersions(migration.version, currentVersion) <= 0) continue;
      if (this.compareVersions(migration.version, target) > 0) break;

      try {
        currentData = await migration.up(currentData);
        currentVersion = migration.version;
      } catch (error) {
        throw new Error(`Migration "${migration.name}" (${migration.version}) failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }

    this.currentVersion = currentVersion;
    return currentData;
  }

  async rollback(data: unknown, targetVersion: string): Promise<unknown> {
    let currentData = data;
    let currentVersion = this.currentVersion;

    for (const migration of [...this.migrations].reverse()) {
      if (this.compareVersions(migration.version, targetVersion) <= 0) break;
      if (this.compareVersions(migration.version, currentVersion) > 0) continue;

      try {
        currentData = await migration.down(currentData);
        currentVersion = this.getPreviousVersion(migration.version);
      } catch (error) {
        throw new Error(`Rollback "${migration.name}" (${migration.version}) failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }

    this.currentVersion = currentVersion;
    return currentData;
  }

  getCurrentVersion(): string {
    return this.currentVersion;
  }

  getLatestVersion(): string {
    if (this.migrations.length === 0) return this.currentVersion;
    return this.migrations[this.migrations.length - 1].version;
  }

  getMigrations(): Migration[] {
    return [...this.migrations];
  }

  private compareVersions(a: string, b: string): number {
    const parseVersion = (v: string) => v.split(".").map(Number);
    const aParts = parseVersion(a);
    const bParts = parseVersion(b);

    for (let i = 0; i < 3; i++) {
      if (aParts[i] !== bParts[i]) return aParts[i] - bParts[i];
    }
    return 0;
  }

  private getPreviousVersion(version: string): string {
    const index = this.migrations.findIndex((m) => m.version === version);
    if (index <= 0) return "0.0.0";
    return this.migrations[index - 1].version;
  }

  clear(): void {
    this.migrations = [];
    this.currentVersion = "0.0.0";
  }
}

export function createMigrationManager(): MigrationManager {
  return new MigrationManager();
}

export function createMigration(
  version: string,
  name: string,
  up: (data: unknown) => Promise<unknown>,
  down: (data: unknown) => Promise<unknown>
): Migration {
  return { version, name, up, down };
}

// Global migration manager
let globalMigrationManager: MigrationManager | null = null;

export function getGlobalMigrationManager(): MigrationManager {
  if (!globalMigrationManager) {
    globalMigrationManager = createMigrationManager();
  }
  return globalMigrationManager;
}

export function setGlobalMigrationManager(manager: MigrationManager): void {
  globalMigrationManager = manager;
}

// Convenience functions
export function addMigration(migration: Migration): void {
  getGlobalMigrationManager().addMigration(migration);
}

export async function migrate(data: unknown, targetVersion?: string): Promise<unknown> {
  return getGlobalMigrationManager().migrate(data, targetVersion);
}

export async function rollback(data: unknown, targetVersion: string): Promise<unknown> {
  return getGlobalMigrationManager().rollback(data, targetVersion);
}

export function getCurrentMigrationVersion(): string {
  return getGlobalMigrationManager().getCurrentVersion();
}

export function getLatestMigrationVersion(): string {
  return getGlobalMigrationManager().getLatestVersion();
}

export function getMigrations(): Migration[] {
  return getGlobalMigrationManager().getMigrations();
}

export function clearMigrations(): void {
  getGlobalMigrationManager().clear();
}
