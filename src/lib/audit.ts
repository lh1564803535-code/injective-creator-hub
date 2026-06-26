/**
 * Audit trail utilities
 */

interface AuditEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId?: string;
  changes?: Record<string, { before: unknown; after: unknown }>;
  metadata?: Record<string, unknown>;
  timestamp: number;
}

class AuditTrail {
  private entries: AuditEntry[] = [];
  private maxEntries: number;

  constructor(maxEntries: number = 10000) {
    this.maxEntries = maxEntries;
  }

  log(entry: Omit<AuditEntry, "id" | "timestamp">): string {
    const id = crypto.randomUUID();
    const auditEntry: AuditEntry = {
      ...entry,
      id,
      timestamp: Date.now(),
    };

    this.entries.push(auditEntry);

    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }

    return id;
  }

  getEntries(options?: {
    entity?: string;
    entityId?: string;
    userId?: string;
    action?: string;
    from?: number;
    to?: number;
    limit?: number;
  }): AuditEntry[] {
    let filtered = [...this.entries];

    if (options?.entity) {
      filtered = filtered.filter((e) => e.entity === options.entity);
    }
    if (options?.entityId) {
      filtered = filtered.filter((e) => e.entityId === options.entityId);
    }
    if (options?.userId) {
      filtered = filtered.filter((e) => e.userId === options.userId);
    }
    if (options?.action) {
      filtered = filtered.filter((e) => e.action === options.action);
    }
    if (options?.from) {
      filtered = filtered.filter((e) => e.timestamp >= options.from!);
    }
    if (options?.to) {
      filtered = filtered.filter((e) => e.timestamp <= options.to!);
    }

    filtered.sort((a, b) => b.timestamp - a.timestamp);

    if (options?.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  }

  getEntityHistory(entity: string, entityId: string): AuditEntry[] {
    return this.getEntries({ entity, entityId });
  }

  getUserActivity(userId: string): AuditEntry[] {
    return this.getEntries({ userId });
  }

  clear(): void {
    this.entries = [];
  }

  getEntryCount(): number {
    return this.entries.length;
  }
}

export function createAuditTrail(maxEntries?: number): AuditTrail {
  return new AuditTrail(maxEntries);
}

export function createAuditEntry(
  action: string,
  entity: string,
  entityId: string,
  options?: Partial<Omit<AuditEntry, "id" | "action" | "entity" | "entityId" | "timestamp">>
): Omit<AuditEntry, "id" | "timestamp"> {
  return {
    action,
    entity,
    entityId,
    ...options,
  };
}

// Global audit trail
let globalAuditTrail: AuditTrail | null = null;

export function getGlobalAuditTrail(): AuditTrail {
  if (!globalAuditTrail) {
    globalAuditTrail = createAuditTrail();
  }
  return globalAuditTrail;
}

export function setGlobalAuditTrail(trail: AuditTrail): void {
  globalAuditTrail = trail;
}

// Convenience functions
export function auditLog(
  action: string,
  entity: string,
  entityId: string,
  options?: Partial<Omit<AuditEntry, "id" | "action" | "entity" | "entityId" | "timestamp">>
): string {
  return getGlobalAuditTrail().log({ action, entity, entityId, ...options });
}

export function getAuditEntries(options?: Parameters<AuditTrail["getEntries"]>[0]): AuditEntry[] {
  return getGlobalAuditTrail().getEntries(options);
}

export function getEntityAuditHistory(entity: string, entityId: string): AuditEntry[] {
  return getGlobalAuditTrail().getEntityHistory(entity, entityId);
}

export function getUserAuditActivity(userId: string): AuditEntry[] {
  return getGlobalAuditTrail().getUserActivity(userId);
}

export function clearAuditTrail(): void {
  getGlobalAuditTrail().clear();
}
