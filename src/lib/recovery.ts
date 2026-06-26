/**
 * Recovery utilities
 */

interface RecoveryAction {
  id: string;
  name: string;
  description: string;
  execute: () => Promise<void>;
  canExecute: () => Promise<boolean>;
}

class RecoveryManager {
  private actions: Map<string, RecoveryAction> = new Map();
  private history: Array<{ actionId: string; success: boolean; timestamp: number; error?: string }> = [];

  register(action: RecoveryAction): void {
    this.actions.set(action.id, action);
  }

  unregister(id: string): void {
    this.actions.delete(id);
  }

  async execute(id: string): Promise<boolean> {
    const action = this.actions.get(id);
    if (!action) {
      throw new Error(`Recovery action "${id}" not found`);
    }

    const canExecute = await action.canExecute();
    if (!canExecute) {
      this.history.push({
        actionId: id,
        success: false,
        timestamp: Date.now(),
        error: "Precondition not met",
      });
      return false;
    }

    try {
      await action.execute();
      this.history.push({
        actionId: id,
        success: true,
        timestamp: Date.now(),
      });
      return true;
    } catch (error) {
      this.history.push({
        actionId: id,
        success: false,
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return false;
    }
  }

  getAction(id: string): RecoveryAction | undefined {
    return this.actions.get(id);
  }

  getAllActions(): RecoveryAction[] {
    return Array.from(this.actions.values());
  }

  getHistory(): Array<{ actionId: string; success: boolean; timestamp: number; error?: string }> {
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }

  clear(): void {
    this.actions.clear();
    this.history = [];
  }
}

export function createRecoveryManager(): RecoveryManager {
  return new RecoveryManager();
}

export function createRecoveryAction(
  id: string,
  name: string,
  description: string,
  execute: () => Promise<void>,
  canExecute: () => Promise<boolean> = async () => true
): RecoveryAction {
  return { id, name, description, execute, canExecute };
}

// Common recovery actions
export function createClearCacheAction(): RecoveryAction {
  return createRecoveryAction(
    "clear-cache",
    "Clear Cache",
    "Clear all cached data and reload",
    async () => {
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
      }
    }
  );
}

export function createResetStateAction(): RecoveryAction {
  return createRecoveryAction(
    "reset-state",
    "Reset Application State",
    "Reset all application state to defaults",
    async () => {
      if (typeof window !== "undefined") {
        localStorage.clear();
        window.location.reload();
      }
    }
  );
}

export function createReconnectWalletAction(): RecoveryAction {
  return createRecoveryAction(
    "reconnect-wallet",
    "Reconnect Wallet",
    "Disconnect and reconnect wallet",
    async () => {
      // In production: disconnect and reconnect wallet
      console.log("Reconnecting wallet...");
    }
  );
}

export function createRetryLastAction(): RecoveryAction {
  return createRecoveryAction(
    "retry-last",
    "Retry Last Action",
    "Retry the last failed action",
    async () => {
      // In production: retry the last failed action
      console.log("Retrying last action...");
    }
  );
}

// Global recovery manager
let globalRecoveryManager: RecoveryManager | null = null;

export function getGlobalRecoveryManager(): RecoveryManager {
  if (!globalRecoveryManager) {
    globalRecoveryManager = createRecoveryManager();
    // Register default recovery actions
    globalRecoveryManager.register(createClearCacheAction());
    globalRecoveryManager.register(createResetStateAction());
    globalRecoveryManager.register(createReconnectWalletAction());
    globalRecoveryManager.register(createRetryLastAction());
  }
  return globalRecoveryManager;
}

export function setGlobalRecoveryManager(manager: RecoveryManager): void {
  globalRecoveryManager = manager;
}

// Convenience functions
export function registerRecoveryAction(action: RecoveryAction): void {
  getGlobalRecoveryManager().register(action);
}

export async function executeRecovery(id: string): Promise<boolean> {
  return getGlobalRecoveryManager().execute(id);
}

export function getRecoveryActions(): RecoveryAction[] {
  return getGlobalRecoveryManager().getAllActions();
}

export function getRecoveryHistory(): Array<{ actionId: string; success: boolean; timestamp: number; error?: string }> {
  return getGlobalRecoveryManager().getHistory();
}

export function clearRecoveryHistory(): void {
  getGlobalRecoveryManager().clearHistory();
}
