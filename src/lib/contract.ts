/**
 * Contract utilities
 */

interface ContractInfo {
  address: string;
  name: string;
  chainId: number;
  abi?: unknown[];
  deployedAt?: number;
}

class ContractRegistry {
  private contracts: Map<string, ContractInfo> = new Map();

  register(contract: ContractInfo): void {
    const key = this.getKey(contract.chainId, contract.address);
    this.contracts.set(key, contract);
  }

  unregister(chainId: number, address: string): void {
    this.contracts.delete(this.getKey(chainId, address));
  }

  get(chainId: number, address: string): ContractInfo | undefined {
    return this.contracts.get(this.getKey(chainId, address));
  }

  getByName(name: string): ContractInfo[] {
    return Array.from(this.contracts.values()).filter((c) => c.name === name);
  }

  getByChain(chainId: number): ContractInfo[] {
    return Array.from(this.contracts.values()).filter((c) => c.chainId === chainId);
  }

  getAll(): ContractInfo[] {
    return Array.from(this.contracts.values());
  }

  private getKey(chainId: number, address: string): string {
    return `${chainId}:${address.toLowerCase()}`;
  }

  clear(): void {
    this.contracts.clear();
  }
}

export function createContractRegistry(): ContractRegistry {
  return new ContractRegistry();
}

export function createContractInfo(
  address: string,
  name: string,
  chainId: number,
  options?: Partial<Omit<ContractInfo, "address" | "name" | "chainId">>
): ContractInfo {
  return {
    address,
    name,
    chainId,
    ...options,
  };
}

export function formatContractAddress(address: string, chars: number = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function isValidContractAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function getContractExplorerUrl(address: string, chainId: number): string {
  const explorers: Record<number, string> = {
    1439: "https://testnet.blockscout.injective.network/address/",
    2525: "https://explorer.injective.network/address/",
  };
  return `${explorers[chainId] || explorers[1439]}${address}`;
}

// Pre-configured contracts
export const INJECTIVE_CONTRACTS = {
  USDC: {
    address: "0xf22bede237a07e121b56d91a491eb7bcdfd1f590",
    name: "USDC",
    chainId: 2525,
  },
  BOUNTY_CAMPAIGN: {
    address: process.env.NEXT_PUBLIC_BOUNTY_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
    name: "BountyCampaign",
    chainId: 1439,
  },
} as const;

// Global contract registry
let globalContractRegistry: ContractRegistry | null = null;

export function getGlobalContractRegistry(): ContractRegistry {
  if (!globalContractRegistry) {
    globalContractRegistry = createContractRegistry();
    // Register default contracts
    globalContractRegistry.register(INJECTIVE_CONTRACTS.USDC);
    globalContractRegistry.register(INJECTIVE_CONTRACTS.BOUNTY_CAMPAIGN);
  }
  return globalContractRegistry;
}

export function setGlobalContractRegistry(registry: ContractRegistry): void {
  globalContractRegistry = registry;
}

// Convenience functions
export function registerContract(contract: ContractInfo): void {
  getGlobalContractRegistry().register(contract);
}

export function getContract(chainId: number, address: string): ContractInfo | undefined {
  return getGlobalContractRegistry().get(chainId, address);
}

export function getContractsByChain(chainId: number): ContractInfo[] {
  return getGlobalContractRegistry().getByChain(chainId);
}

export function getContractsByName(name: string): ContractInfo[] {
  return getGlobalContractRegistry().getByName(name);
}
