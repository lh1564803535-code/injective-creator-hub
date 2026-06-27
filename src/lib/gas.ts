/**
 * Gas utilities
 */

interface GasEstimate {
  gasLimit: bigint;
  gasPrice: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  estimatedCost: bigint;
  estimatedCostUsd?: number;
}

interface GasPrice {
  slow: bigint;
  standard: bigint;
  fast: bigint;
  instant: bigint;
}

class GasManager {
  private gasPrice: GasPrice | null = null;
  private listeners: Set<(gasPrice: GasPrice) => void> = new Set();

  updateGasPrice(gasPrice: GasPrice): void {
    this.gasPrice = gasPrice;
    this.notify();
  }

  getGasPrice(): GasPrice | null {
    return this.gasPrice;
  }

  getGasPriceForSpeed(speed: "slow" | "standard" | "fast" | "instant"): bigint | null {
    return this.gasPrice?.[speed] ?? null;
  }

  estimateCost(gasLimit: bigint, speed: "slow" | "standard" | "fast" | "instant" = "standard"): GasEstimate | null {
    if (!this.gasPrice) return null;

    const gasPrice = this.gasPrice[speed];
    const estimatedCost = gasLimit * gasPrice;

    return {
      gasLimit,
      gasPrice,
      estimatedCost,
    };
  }

  subscribe(listener: (gasPrice: GasPrice) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    if (this.gasPrice) {
      this.listeners.forEach((listener) => {
        try {
          listener(this.gasPrice!);
        } catch (error) {
          console.error("Error in gas price listener:", error);
        }
      });
    }
  }
}

export function createGasManager(): GasManager {
  return new GasManager();
}

export function createGasPrice(
  slow: bigint,
  standard: bigint,
  fast: bigint,
  instant: bigint
): GasPrice {
  return { slow, standard, fast, instant };
}

export function formatGasPrice(gasPrice: bigint, unit: "wei" | "gwei" | "ether" = "gwei"): string {
  switch (unit) {
    case "wei":
      return `${gasPrice} wei`;
    case "gwei":
      return `${Number(gasPrice) / 1e9} gwei`;
    case "ether":
      return `${Number(gasPrice) / 1e18} ETH`;
  }
}

export function formatGasCost(cost: bigint, decimals: number = 18): string {
  const divisor = BigInt(10 ** decimals);
  const wholePart = cost / divisor;
  const fractionalPart = cost % divisor;
  const fractionalStr = fractionalPart.toString().padStart(decimals, "0").slice(0, 6);
  return `${wholePart.toLocaleString()}.${fractionalStr}`;
}

export function calculateGasSavings(
  originalGas: bigint,
  optimizedGas: bigint
): { saved: bigint; percentage: number } {
  const saved = originalGas - optimizedGas;
  const percentage = Number((saved * BigInt(100)) / originalGas);
  return { saved, percentage };
}

// Injective-specific gas utilities
export const INJECTIVE_GAS = {
  CHAIN_ID: 1439,
  MAINNET_CHAIN_ID: 2525,
  NATIVE_TOKEN: "INJ",
  DECIMALS: 18,
  AVG_BLOCK_TIME: 1.2, // seconds
  TYPICAL_GAS_PRICE: BigInt("1000000000"), // 1 gwei
} as const;

export function estimateInjectiveGas(
  operation: "vote" | "submit" | "claim" | "transfer" | "deploy"
): GasEstimate {
  const gasLimits: Record<string, bigint> = {
    vote: BigInt(100000),
    submit: BigInt(200000),
    claim: BigInt(150000),
    transfer: BigInt(50000),
    deploy: BigInt(5000000),
  };

  const gasLimit = gasLimits[operation] || BigInt(100000);
  const gasPrice = INJECTIVE_GAS.TYPICAL_GAS_PRICE;

  return {
    gasLimit,
    gasPrice,
    estimatedCost: gasLimit * gasPrice,
  };
}

export function formatInjectiveGas(cost: bigint): string {
  return `${Number(cost) / 1e18} INJ`;
}

// Global gas manager
let globalGasManager: GasManager | null = null;

export function getGlobalGasManager(): GasManager {
  if (!globalGasManager) {
    globalGasManager = createGasManager();
  }
  return globalGasManager;
}

export function setGlobalGasManager(manager: GasManager): void {
  globalGasManager = manager;
}

// Convenience functions
export function updateGasPrice(gasPrice: GasPrice): void {
  getGlobalGasManager().updateGasPrice(gasPrice);
}

export function getGasPrice(): GasPrice | null {
  return getGlobalGasManager().getGasPrice();
}

export function estimateGasCost(gasLimit: bigint, speed?: "slow" | "standard" | "fast" | "instant"): GasEstimate | null {
  return getGlobalGasManager().estimateCost(gasLimit, speed);
}
