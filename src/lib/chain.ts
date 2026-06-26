/**
 * Chain utilities
 */

interface ChainConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  testnet: boolean;
}

class ChainManager {
  private chains: Map<number, ChainConfig> = new Map();
  private activeChainId: number | null = null;
  private listeners: Set<(chainId: number | null) => void> = new Set();

  addChain(config: ChainConfig): void {
    this.chains.set(config.chainId, config);
  }

  removeChain(chainId: number): void {
    this.chains.delete(chainId);
    if (this.activeChainId === chainId) {
      this.activeChainId = null;
      this.notify();
    }
  }

  switchChain(chainId: number): boolean {
    if (!this.chains.has(chainId)) return false;
    this.activeChainId = chainId;
    this.notify();
    return true;
  }

  getChain(chainId: number): ChainConfig | undefined {
    return this.chains.get(chainId);
  }

  getActiveChain(): ChainConfig | undefined {
    return this.activeChainId ? this.chains.get(this.activeChainId) : undefined;
  }

  getActiveChainId(): number | null {
    return this.activeChainId;
  }

  getAllChains(): ChainConfig[] {
    return Array.from(this.chains.values());
  }

  getTestnets(): ChainConfig[] {
    return this.getAllChains().filter((c) => c.testnet);
  }

  getMainnets(): ChainConfig[] {
    return this.getAllChains().filter((c) => !c.testnet);
  }

  subscribe(listener: (chainId: number | null) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.activeChainId);
      } catch (error) {
        console.error("Error in chain listener:", error);
      }
    });
  }
}

export function createChainManager(): ChainManager {
  return new ChainManager();
}

export function createChainConfig(
  chainId: number,
  name: string,
  rpcUrl: string,
  explorerUrl: string,
  nativeCurrency: ChainConfig["nativeCurrency"],
  testnet: boolean = false
): ChainConfig {
  return {
    chainId,
    name,
    rpcUrl,
    explorerUrl,
    nativeCurrency,
    testnet,
  };
}

// Pre-configured chains
export const INJECTIVE_TESTNET: ChainConfig = {
  chainId: 1439,
  name: "Injective EVM Testnet",
  rpcUrl: "https://k8s.testnet.json-rpc.injective.network/",
  explorerUrl: "https://testnet.blockscout.injective.network/",
  nativeCurrency: {
    name: "INJ",
    symbol: "INJ",
    decimals: 18,
  },
  testnet: true,
};

export const INJECTIVE_MAINNET: ChainConfig = {
  chainId: 2525,
  name: "Injective EVM Mainnet",
  rpcUrl: "https://k8s.global.mainnet.lcd.injective.network",
  explorerUrl: "https://explorer.injective.network",
  nativeCurrency: {
    name: "INJ",
    symbol: "INJ",
    decimals: 18,
  },
  testnet: false,
};

// Global chain manager
let globalChainManager: ChainManager | null = null;

export function getGlobalChainManager(): ChainManager {
  if (!globalChainManager) {
    globalChainManager = createChainManager();
    // Register default chains
    globalChainManager.addChain(INJECTIVE_TESTNET);
    globalChainManager.addChain(INJECTIVE_MAINNET);
  }
  return globalChainManager;
}

export function setGlobalChainManager(manager: ChainManager): void {
  globalChainManager = manager;
}

// Convenience functions
export function switchChain(chainId: number): boolean {
  return getGlobalChainManager().switchChain(chainId);
}

export function getActiveChain(): ChainConfig | undefined {
  return getGlobalChainManager().getActiveChain();
}

export function getActiveChainId(): number | null {
  return getGlobalChainManager().getActiveChainId();
}

export function getChainConfig(chainId: number): ChainConfig | undefined {
  return getGlobalChainManager().getChain(chainId);
}

export function getAllChains(): ChainConfig[] {
  return getGlobalChainManager().getAllChains();
}

export function isTestnet(chainId: number): boolean {
  const chain = getChainConfig(chainId);
  return chain?.testnet ?? false;
}

export function getExplorerUrl(chainId: number, path: string): string {
  const chain = getChainConfig(chainId);
  return chain ? `${chain.explorerUrl}${path}` : "";
}
