/**
 * Transaction utilities
 */

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: bigint;
  data?: string;
  chainId: number;
  status: "pending" | "confirmed" | "failed";
  timestamp: number;
  blockNumber?: number;
  gasUsed?: bigint;
  gasPrice?: bigint;
}

class TransactionManager {
  private transactions: Map<string, Transaction> = new Map();
  private listeners: Set<(tx: Transaction) => void> = new Set();

  add(tx: Transaction): void {
    this.transactions.set(tx.hash, tx);
    this.notify(tx);
  }

  update(hash: string, updates: Partial<Transaction>): void {
    const tx = this.transactions.get(hash);
    if (tx) {
      Object.assign(tx, updates);
      this.notify(tx);
    }
  }

  get(hash: string): Transaction | undefined {
    return this.transactions.get(hash);
  }

  getAll(): Transaction[] {
    return Array.from(this.transactions.values());
  }

  getByAddress(address: string): Transaction[] {
    return this.getAll().filter(
      (tx) => tx.from.toLowerCase() === address.toLowerCase() ||
              tx.to.toLowerCase() === address.toLowerCase()
    );
  }

  getPending(): Transaction[] {
    return this.getAll().filter((tx) => tx.status === "pending");
  }

  getConfirmed(): Transaction[] {
    return this.getAll().filter((tx) => tx.status === "confirmed");
  }

  getFailed(): Transaction[] {
    return this.getAll().filter((tx) => tx.status === "failed");
  }

  subscribe(listener: (tx: Transaction) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(tx: Transaction): void {
    this.listeners.forEach((listener) => {
      try {
        listener(tx);
      } catch (error) {
        console.error("Error in transaction listener:", error);
      }
    });
  }

  clear(): void {
    this.transactions.clear();
  }
}

export function createTransactionManager(): TransactionManager {
  return new TransactionManager();
}

export function createTransaction(
  hash: string,
  from: string,
  to: string,
  value: bigint,
  chainId: number,
  options?: Partial<Omit<Transaction, "hash" | "from" | "to" | "value" | "chainId" | "status" | "timestamp">>
): Transaction {
  return {
    hash,
    from,
    to,
    value,
    chainId,
    status: "pending",
    timestamp: Date.now(),
    ...options,
  };
}

export function formatTransactionHash(hash: string, chars: number = 6): string {
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

export function getExplorerUrl(hash: string, chainId: number): string {
  const explorers: Record<number, string> = {
    1439: "https://testnet.blockscout.injective.network/tx/",
    2525: "https://explorer.injective.network/tx/",
  };
  return `${explorers[chainId] || explorers[1439]}${hash}`;
}

export function getExplorerAddressUrl(address: string, chainId: number): string {
  const explorers: Record<number, string> = {
    1439: "https://testnet.blockscout.injective.network/address/",
    2525: "https://explorer.injective.network/address/",
  };
  return `${explorers[chainId] || explorers[1439]}${address}`;
}

// Global transaction manager
let globalTransactionManager: TransactionManager | null = null;

export function getGlobalTransactionManager(): TransactionManager {
  if (!globalTransactionManager) {
    globalTransactionManager = createTransactionManager();
  }
  return globalTransactionManager;
}

export function setGlobalTransactionManager(manager: TransactionManager): void {
  globalTransactionManager = manager;
}

// Convenience functions
export function addTransaction(tx: Transaction): void {
  getGlobalTransactionManager().add(tx);
}

export function updateTransaction(hash: string, updates: Partial<Transaction>): void {
  getGlobalTransactionManager().update(hash, updates);
}

export function getTransaction(hash: string): Transaction | undefined {
  return getGlobalTransactionManager().get(hash);
}

export function getTransactionsByAddress(address: string): Transaction[] {
  return getGlobalTransactionManager().getByAddress(address);
}

export function getPendingTransactions(): Transaction[] {
  return getGlobalTransactionManager().getPending();
}
