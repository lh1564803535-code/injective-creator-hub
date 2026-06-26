/**
 * Backup utilities
 */

interface BackupData {
  version: string;
  timestamp: number;
  data: Record<string, unknown>;
  checksum: string;
}

class BackupManager {
  private backups: Map<string, BackupData> = new Map();

  async createBackup(name: string, data: Record<string, unknown>): Promise<BackupData> {
    const backup: BackupData = {
      version: "1.0.0",
      timestamp: Date.now(),
      data,
      checksum: await this.calculateChecksum(JSON.stringify(data)),
    };

    this.backups.set(name, backup);
    return backup;
  }

  getBackup(name: string): BackupData | undefined {
    return this.backups.get(name);
  }

  getAllBackups(): BackupData[] {
    return Array.from(this.backups.values());
  }

  deleteBackup(name: string): boolean {
    return this.backups.delete(name);
  }

  async restoreBackup(name: string): Promise<Record<string, unknown> | null> {
    const backup = this.backups.get(name);
    if (!backup) return null;

    // Verify checksum
    const currentChecksum = await this.calculateChecksum(JSON.stringify(backup.data));
    if (currentChecksum !== backup.checksum) {
      throw new Error("Backup integrity check failed");
    }

    return backup.data;
  }

  async exportBackup(name: string): Promise<string> {
    const backup = this.backups.get(name);
    if (!backup) throw new Error(`Backup "${name}" not found`);
    return JSON.stringify(backup, null, 2);
  }

  async importBackup(name: string, json: string): Promise<BackupData> {
    try {
      const backup: BackupData = JSON.parse(json);

      // Verify checksum
      const currentChecksum = await this.calculateChecksum(JSON.stringify(backup.data));
      if (currentChecksum !== backup.checksum) {
        throw new Error("Backup integrity check failed");
      }

      this.backups.set(name, backup);
      return backup;
    } catch (error) {
      throw new Error(`Failed to import backup: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  private async calculateChecksum(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
    const bytes = new Uint8Array(buffer);
    return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  clear(): void {
    this.backups.clear();
  }
}

export function createBackupManager(): BackupManager {
  return new BackupManager();
}

// Global backup manager
let globalBackupManager: BackupManager | null = null;

export function getGlobalBackupManager(): BackupManager {
  if (!globalBackupManager) {
    globalBackupManager = createBackupManager();
  }
  return globalBackupManager;
}

export function setGlobalBackupManager(manager: BackupManager): void {
  globalBackupManager = manager;
}

// Convenience functions
export async function createBackup(name: string, data: Record<string, unknown>): Promise<BackupData> {
  return getGlobalBackupManager().createBackup(name, data);
}

export function getBackup(name: string): BackupData | undefined {
  return getGlobalBackupManager().getBackup(name);
}

export function getAllBackups(): BackupData[] {
  return getGlobalBackupManager().getAllBackups();
}

export function deleteBackup(name: string): boolean {
  return getGlobalBackupManager().deleteBackup(name);
}

export async function restoreBackup(name: string): Promise<Record<string, unknown> | null> {
  return getGlobalBackupManager().restoreBackup(name);
}

export async function exportBackup(name: string): Promise<string> {
  return getGlobalBackupManager().exportBackup(name);
}

export async function importBackup(name: string, json: string): Promise<BackupData> {
  return getGlobalBackupManager().importBackup(name, json);
}

export function clearBackups(): void {
  getGlobalBackupManager().clear();
}
