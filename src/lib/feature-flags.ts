/**
 * Feature flags utilities
 */

interface FeatureFlag {
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage?: number;
  allowedUsers?: string[];
  blockedUsers?: string[];
}

class FeatureFlagManager {
  private flags: Map<string, FeatureFlag> = new Map();
  private listeners: Set<(flags: Map<string, FeatureFlag>) => void> = new Set();

  register(flag: FeatureFlag): void {
    this.flags.set(flag.name, flag);
    this.notify();
  }

  unregister(name: string): void {
    this.flags.delete(name);
    this.notify();
  }

  isEnabled(name: string, userId?: string): boolean {
    const flag = this.flags.get(name);
    if (!flag) return false;

    // Check if user is blocked
    if (userId && flag.blockedUsers?.includes(userId)) {
      return false;
    }

    // Check if user is in allowed list
    if (flag.allowedUsers && flag.allowedUsers.length > 0) {
      return userId ? flag.allowedUsers.includes(userId) : false;
    }

    // Check rollout percentage
    if (flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100) {
      const hash = userId ? this.hashString(userId) : Math.random() * 100;
      return hash < flag.rolloutPercentage;
    }

    return flag.enabled;
  }

  enable(name: string): void {
    const flag = this.flags.get(name);
    if (flag) {
      flag.enabled = true;
      this.notify();
    }
  }

  disable(name: string): void {
    const flag = this.flags.get(name);
    if (flag) {
      flag.enabled = false;
      this.notify();
    }
  }

  toggle(name: string): void {
    const flag = this.flags.get(name);
    if (flag) {
      flag.enabled = !flag.enabled;
      this.notify();
    }
  }

  getAll(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }

  getEnabled(): FeatureFlag[] {
    return this.getAll().filter((f) => f.enabled);
  }

  getDisabled(): FeatureFlag[] {
    return this.getAll().filter((f) => !f.enabled);
  }

  subscribe(listener: (flags: Map<string, FeatureFlag>) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash) % 100;
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(new Map(this.flags));
      } catch (error) {
        console.error("Error in feature flag listener:", error);
      }
    });
  }
}

export function createFeatureFlagManager(): FeatureFlagManager {
  return new FeatureFlagManager();
}

export function createFeatureFlag(
  name: string,
  description: string,
  options?: Partial<Omit<FeatureFlag, "name" | "description">>
): FeatureFlag {
  return {
    name,
    description,
    enabled: false,
    ...options,
  };
}

// Global feature flag manager
let globalFeatureFlagManager: FeatureFlagManager | null = null;

export function getGlobalFeatureFlagManager(): FeatureFlagManager {
  if (!globalFeatureFlagManager) {
    globalFeatureFlagManager = createFeatureFlagManager();
  }
  return globalFeatureFlagManager;
}

export function setGlobalFeatureFlagManager(manager: FeatureFlagManager): void {
  globalFeatureFlagManager = manager;
}

// Convenience functions
export function registerFeatureFlag(flag: FeatureFlag): void {
  getGlobalFeatureFlagManager().register(flag);
}

export function isFeatureEnabled(name: string, userId?: string): boolean {
  return getGlobalFeatureFlagManager().isEnabled(name, userId);
}

export function enableFeature(name: string): void {
  getGlobalFeatureFlagManager().enable(name);
}

export function disableFeature(name: string): void {
  getGlobalFeatureFlagManager().disable(name);
}

export function toggleFeature(name: string): void {
  getGlobalFeatureFlagManager().toggle(name);
}

export function getAllFeatureFlags(): FeatureFlag[] {
  return getGlobalFeatureFlagManager().getAll();
}
