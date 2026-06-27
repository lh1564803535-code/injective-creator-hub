/**
 * Allowance utilities
 */

interface AllowanceInfo {
  token: string;
  owner: string;
  spender: string;
  allowance: bigint;
  timestamp: number;
}

class AllowanceManager {
  private allowances: Map<string, AllowanceInfo> = new Map();
  private listeners: Set<(info: AllowanceInfo) => void> = new Set();

  private getKey(token: string, owner: string, spender: string): string {
    return `${token}:${owner}:${spender}`;
  }

  getAllowance(token: string, owner: string, spender: string): AllowanceInfo | undefined {
    return this.allowances.get(this.getKey(token, owner, spender));
  }

  setAllowance(token: string, owner: string, spender: string, allowance: bigint): void {
    const info: AllowanceInfo = {
      token,
      owner,
      spender,
      allowance,
      timestamp: Date.now(),
    };
    this.allowances.set(this.getKey(token, owner, spender), info);
    this.notify(info);
  }

  increaseAllowance(token: string, owner: string, spender: string, amount: bigint): void {
    const current = this.getAllowance(token, owner, spender);
    const newAllowance = (current?.allowance ?? BigInt(0)) + amount;
    this.setAllowance(token, owner, spender, newAllowance);
  }

  decreaseAllowance(token: string, owner: string, spender: string, amount: bigint): void {
    const current = this.getAllowance(token, owner, spender);
    if (!current) return;
    const newAllowance = current.allowance > amount ? current.allowance - amount : BigInt(0);
    this.setAllowance(token, owner, spender, newAllowance);
  }

  revokeAllowance(token: string, owner: string, spender: string): void {
    this.setAllowance(token, owner, spender, BigInt(0));
  }

  getMaxAllowance(): bigint {
    return BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
  }

  isMaxAllowance(token: string, owner: string, spender: string): boolean {
    const info = this.getAllowance(token, owner, spender);
    return info?.allowance === this.getMaxAllowance();
  }

  hasSufficientAllowance(token: string, owner: string, spender: string, amount: bigint): boolean {
    const info = this.getAllowance(token, owner, spender);
    return (info?.allowance ?? BigInt(0)) >= amount;
  }

  subscribe(listener: (info: AllowanceInfo) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(info: AllowanceInfo): void {
    this.listeners.forEach((listener) => {
      try {
        listener(info);
      } catch (error) {
        console.error("Error in allowance listener:", error);
      }
    });
  }

  clear(): void {
    this.allowances.clear();
  }
}

export function createAllowanceManager(): AllowanceManager {
  return new AllowanceManager();
}

// Global allowance manager
let globalAllowanceManager: AllowanceManager | null = null;

export function getGlobalAllowanceManager(): AllowanceManager {
  if (!globalAllowanceManager) {
    globalAllowanceManager = createAllowanceManager();
  }
  return globalAllowanceManager;
}

export function setGlobalAllowanceManager(manager: AllowanceManager): void {
  globalAllowanceManager = manager;
}

// Convenience functions
export function getAllowance(token: string, owner: string, spender: string): AllowanceInfo | undefined {
  return getGlobalAllowanceManager().getAllowance(token, owner, spender);
}

export function setAllowance(token: string, owner: string, spender: string, allowance: bigint): void {
  getGlobalAllowanceManager().setAllowance(token, owner, spender, allowance);
}

export function increaseAllowance(token: string, owner: string, spender: string, amount: bigint): void {
  getGlobalAllowanceManager().increaseAllowance(token, owner, spender, amount);
}

export function decreaseAllowance(token: string, owner: string, spender: string, amount: bigint): void {
  getGlobalAllowanceManager().decreaseAllowance(token, owner, spender, amount);
}

export function revokeAllowance(token: string, owner: string, spender: string): void {
  getGlobalAllowanceManager().revokeAllowance(token, owner, spender);
}

export function hasSufficientAllowance(token: string, owner: string, spender: string, amount: bigint): boolean {
  return getGlobalAllowanceManager().hasSufficientAllowance(token, owner, spender, amount);
}

export function isMaxAllowance(token: string, owner: string, spender: string): boolean {
  return getGlobalAllowanceManager().isMaxAllowance(token, owner, spender);
}
