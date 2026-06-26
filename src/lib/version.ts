/**
 * Version utilities
 */

interface Version {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
}

class VersionManager {
  private versions: Map<string, Version> = new Map();
  private currentVersion: Version | null = null;

  setCurrentVersion(version: Version): void {
    this.currentVersion = version;
  }

  getCurrentVersion(): Version | null {
    return this.currentVersion;
  }

  addVersion(name: string, version: Version): void {
    this.versions.set(name, version);
  }

  getVersion(name: string): Version | undefined {
    return this.versions.get(name);
  }

  getAllVersions(): Map<string, Version> {
    return new Map(this.versions);
  }

  compareVersions(a: Version, b: Version): number {
    if (a.major !== b.major) return a.major - b.major;
    if (a.minor !== b.minor) return a.minor - b.minor;
    if (a.patch !== b.patch) return a.patch - b.patch;
    if (a.prerelease && b.prerelease) {
      return a.prerelease.localeCompare(b.prerelease);
    }
    if (a.prerelease) return -1;
    if (b.prerelease) return 1;
    return 0;
  }

  isNewer(a: Version, b: Version): boolean {
    return this.compareVersions(a, b) > 0;
  }

  isOlder(a: Version, b: Version): boolean {
    return this.compareVersions(a, b) < 0;
  }

  isEqual(a: Version, b: Version): boolean {
    return this.compareVersions(a, b) === 0;
  }

  formatVersion(version: Version): string {
    let str = `${version.major}.${version.minor}.${version.patch}`;
    if (version.prerelease) {
      str += `-${version.prerelease}`;
    }
    return str;
  }

  parseVersion(versionStr: string): Version {
    const match = versionStr.match(/^(\d+)\.(\d+)\.(\d+)(?:-(.+))?$/);
    if (!match) {
      throw new Error(`Invalid version format: ${versionStr}`);
    }

    return {
      major: parseInt(match[1]),
      minor: parseInt(match[2]),
      patch: parseInt(match[3]),
      prerelease: match[4],
    };
  }

  clear(): void {
    this.versions.clear();
    this.currentVersion = null;
  }
}

export function createVersionManager(): VersionManager {
  return new VersionManager();
}

export function createVersion(
  major: number,
  minor: number,
  patch: number,
  prerelease?: string
): Version {
  return { major, minor, patch, prerelease };
}

export function parseVersion(versionStr: string): Version {
  const manager = createVersionManager();
  return manager.parseVersion(versionStr);
}

export function formatVersion(version: Version): string {
  const manager = createVersionManager();
  return manager.formatVersion(version);
}

export function compareVersions(a: Version, b: Version): number {
  const manager = createVersionManager();
  return manager.compareVersions(a, b);
}

export function isNewer(a: Version, b: Version): boolean {
  return compareVersions(a, b) > 0;
}

export function isOlder(a: Version, b: Version): boolean {
  return compareVersions(a, b) < 0;
}

export function isEqual(a: Version, b: Version): boolean {
  return compareVersions(a, b) === 0;
}

// Global version manager
let globalVersionManager: VersionManager | null = null;

export function getGlobalVersionManager(): VersionManager {
  if (!globalVersionManager) {
    globalVersionManager = createVersionManager();
  }
  return globalVersionManager;
}

export function setGlobalVersionManager(manager: VersionManager): void {
  globalVersionManager = manager;
}

// Convenience functions
export function setCurrentVersion(version: Version): void {
  getGlobalVersionManager().setCurrentVersion(version);
}

export function getCurrentVersion(): Version | null {
  return getGlobalVersionManager().getCurrentVersion();
}

export function addVersion(name: string, version: Version): void {
  getGlobalVersionManager().addVersion(name, version);
}

export function getVersion(name: string): Version | undefined {
  return getGlobalVersionManager().getVersion(name);
}

export function getAppVersion(): string {
  const version = getCurrentVersion();
  if (!version) return "0.0.0";
  return formatVersion(version);
}
