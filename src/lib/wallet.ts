/**
 * Wallet utilities
 */

interface WalletInfo {
  address: string;
  chainId: number;
  balance: bigint;
  isConnected: boolean;
}

class WalletManager {
  private wallet: WalletInfo | null = null;
  private listeners: Set<(wallet: WalletInfo | null) => void> = new Set();

  connect(address: string, chainId: number, balance: bigint = 0n): void {
    this.wallet = {
      address,
      chainId,
      balance,
      isConnected: true,
    };
    this.notify();
  }

  disconnect(): void {
    this.wallet = null;
    this.notify();
  }

  updateBalance(balance: bigint): void {
    if (this.wallet) {
      this.wallet.balance = balance;
      this.notify();
    }
  }

  updateChainId(chainId: number): void {
    if (this.wallet) {
      this.wallet.chainId = chainId;
      this.notify();
    }
  }

  getWallet(): WalletInfo | null {
    return this.wallet;
  }

  getAddress(): string | null {
    return this.wallet?.address ?? null;
  }

  isConnected(): boolean {
    return this.wallet?.isConnected ?? false;
  }

  subscribe(listener: (wallet: WalletInfo | null) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.wallet);
      } catch (error) {
        console.error("Error in wallet listener:", error);
      }
    });
  }
}

export function createWalletManager(): WalletManager {
  return new WalletManager();
}

export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function formatBalance(balance: bigint, decimals: number = 18, displayDecimals: number = 4): string {
  const divisor = BigInt(10 ** decimals);
  const wholePart = balance / divisor;
  const fractionalPart = balance % divisor;
  const fractionalStr = fractionalPart.toString().padStart(decimals, "0").slice(0, displayDecimals);
  return `${wholePart.toLocaleString()}.${fractionalStr}`;
}

export function parseBalance(balance: string, decimals: number = 18): bigint {
  const [whole, fraction = ""] = balance.split(".");
  const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(whole) * BigInt(10 ** decimals) + BigInt(paddedFraction);
}

// Global wallet manager
let globalWalletManager: WalletManager | null = null;

export function getGlobalWalletManager(): WalletManager {
  if (!globalWalletManager) {
    globalWalletManager = createWalletManager();
  }
  return globalWalletManager;
}

export function setGlobalWalletManager(manager: WalletManager): void {
  globalWalletManager = manager;
}

// Convenience functions
export function connectWallet(address: string, chainId: number, balance?: bigint): void {
  getGlobalWalletManager().connect(address, chainId, balance);
}

export function disconnectWallet(): void {
  getGlobalWalletManager().disconnect();
}

export function getWalletAddress(): string | null {
  return getGlobalWalletManager().getAddress();
}

export function isWalletConnected(): boolean {
  return getGlobalWalletManager().isConnected();
}

export function getWalletInfo(): WalletInfo | null {
  return getGlobalWalletManager().getWallet();
}
