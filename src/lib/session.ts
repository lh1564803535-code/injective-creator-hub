/**
 * Session utilities
 */

interface Session {
  id: string;
  userId?: string;
  data: Record<string, unknown>;
  createdAt: number;
  lastAccessedAt: number;
  expiresAt: number;
}

class SessionManager {
  private sessions: Map<string, Session> = new Map();
  private maxSessions: number;
  private defaultTtl: number; // milliseconds

  constructor(maxSessions: number = 1000, defaultTtl: number = 3600000) {
    this.maxSessions = maxSessions;
    this.defaultTtl = defaultTtl;
  }

  create(userId?: string, data: Record<string, unknown> = {}): string {
    const id = crypto.randomUUID();
    const now = Date.now();

    const session: Session = {
      id,
      userId,
      data,
      createdAt: now,
      lastAccessedAt: now,
      expiresAt: now + this.defaultTtl,
    };

    this.sessions.set(id, session);
    this.cleanup();

    return id;
  }

  get(id: string): Session | undefined {
    const session = this.sessions.get(id);
    if (!session) return undefined;

    // Check expiration
    if (Date.now() > session.expiresAt) {
      this.sessions.delete(id);
      return undefined;
    }

    // Update last accessed
    session.lastAccessedAt = Date.now();
    return session;
  }

  update(id: string, data: Record<string, unknown>): boolean {
    const session = this.get(id);
    if (!session) return false;

    session.data = { ...session.data, ...data };
    session.lastAccessedAt = Date.now();
    return true;
  }

  set(id: string, key: string, value: unknown): boolean {
    const session = this.get(id);
    if (!session) return false;

    session.data[key] = value;
    session.lastAccessedAt = Date.now();
    return true;
  }

  getKeyValue<T>(id: string, key: string): T | undefined {
    const session = this.get(id);
    return session?.data[key] as T;
  }

  delete(id: string): boolean {
    return this.sessions.delete(id);
  }

  extend(id: string, ttl?: number): boolean {
    const session = this.get(id);
    if (!session) return false;

    session.expiresAt = Date.now() + (ttl || this.defaultTtl);
    return true;
  }

  getByUser(userId: string): Session[] {
    return Array.from(this.sessions.values()).filter((s) => s.userId === userId);
  }

  deleteByUser(userId: string): void {
    for (const [id, session] of this.sessions) {
      if (session.userId === userId) {
        this.sessions.delete(id);
      }
    }
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [id, session] of this.sessions) {
      if (now > session.expiresAt) {
        this.sessions.delete(id);
      }
    }

    // Remove oldest if over limit
    if (this.sessions.size > this.maxSessions) {
      const sorted = Array.from(this.sessions.entries())
        .sort(([, a], [, b]) => a.lastAccessedAt - b.lastAccessedAt);
      const toRemove = sorted.slice(0, sorted.length - this.maxSessions);
      toRemove.forEach(([id]) => this.sessions.delete(id));
    }
  }

  clear(): void {
    this.sessions.clear();
  }

  getActiveCount(): number {
    this.cleanup();
    return this.sessions.size;
  }
}

export function createSessionManager(maxSessions?: number, defaultTtl?: number): SessionManager {
  return new SessionManager(maxSessions, defaultTtl);
}

// Global session manager
let globalSessionManager: SessionManager | null = null;

export function getGlobalSessionManager(): SessionManager {
  if (!globalSessionManager) {
    globalSessionManager = createSessionManager();
  }
  return globalSessionManager;
}

export function setGlobalSessionManager(manager: SessionManager): void {
  globalSessionManager = manager;
}

// Convenience functions
export function createSession(userId?: string, data?: Record<string, unknown>): string {
  return getGlobalSessionManager().create(userId, data);
}

export function getSession(id: string): Session | undefined {
  return getGlobalSessionManager().get(id);
}

export function updateSession(id: string, data: Record<string, unknown>): boolean {
  return getGlobalSessionManager().update(id, data);
}

export function setSessionValue(id: string, key: string, value: unknown): boolean {
  return getGlobalSessionManager().set(id, key, value);
}

export function getSessionValue<T>(id: string, key: string): T | undefined {
  return getGlobalSessionManager().getKeyValue<T>(id, key);
}

export function deleteSession(id: string): boolean {
  return getGlobalSessionManager().delete(id);
}

export function extendSession(id: string, ttl?: number): boolean {
  return getGlobalSessionManager().extend(id, ttl);
}
