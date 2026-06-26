/**
 * Contract Client utilities
 */

interface ContractCall {
  to: string;
  data: string;
  value?: bigint;
}

interface ContractConfig {
  address: string;
  abi: unknown[];
  chainId: number;
}

class ContractClient {
  private config: ContractConfig;

  constructor(config: ContractConfig) {
    this.config = config;
  }

  getAddress(): string {
    return this.config.address;
  }

  getAbi(): unknown[] {
    return this.config.abi;
  }

  getChainId(): number {
    return this.config.chainId;
  }

  encodeFunction(functionName: string, params: unknown[]): string {
    // Simplified - in production use ethers.js or viem
    const functionAbi = (this.config.abi as Array<{ name: string; type: string }>).find(
      (item) => item.name === functionName
    );
    if (!functionAbi) {
      throw new Error(`Function ${functionName} not found in ABI`);
    }

    const signature = `${functionName}(${functionAbi.type})`;
    const selector = this.simpleHash(signature).slice(0, 8);
    const encodedParams = params.map((p) => this.encodeParam(p)).join("");
    return `0x${selector}${encodedParams}`;
  }

  createCall(functionName: string, params: unknown[]): ContractCall {
    return {
      to: this.config.address,
      data: this.encodeFunction(functionName, params),
    };
  }

  private simpleHash(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(64, "0");
  }

  private encodeParam(value: unknown): string {
    if (typeof value === "number") {
      return value.toString(16).padStart(64, "0");
    }
    if (typeof value === "string") {
      if (value.startsWith("0x")) {
        return value.slice(2).padStart(64, "0");
      }
      return Buffer.from(value).toString("hex").padStart(64, "0");
    }
    if (typeof value === "boolean") {
      return value ? "1".padStart(64, "0") : "0".padStart(64, "0");
    }
    return "".padStart(64, "0");
  }
}

export function createContractClient(config: ContractConfig): ContractClient {
  return new ContractClient(config);
}

// Pre-configured contract clients
export const INJECTIVE_CONTRACT_CLIENTS = {
  USDC: createContractClient({
    address: "0xf22bede237a07e121b56d91a491eb7bcdfd1f590",
    abi: [
      "function balanceOf(address) view returns (uint256)",
      "function transfer(address to, uint256 amount) returns (bool)",
      "function approve(address spender, uint256 amount) returns (bool)",
      "function decimals() view returns (uint8)",
      "function symbol() view returns (string)",
    ],
    chainId: 2525,
  }),
  BOUNTY_CAMPAIGN: createContractClient({
    address: process.env.NEXT_PUBLIC_BOUNTY_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
    abi: [
      "function createCampaign(string title, string description, uint256 totalReward, uint256 deadline) returns (uint256)",
      "function submitContent(uint256 campaignId, string contentHash)",
      "function vote(uint256 submissionId, uint256 weight)",
      "function settleCampaign(uint256 campaignId)",
      "function claimReward(uint256 submissionId)",
      "function getCampaign(uint256 campaignId) view returns (tuple)",
      "function getSubmission(uint256 submissionId) view returns (tuple)",
    ],
    chainId: 1439,
  }),
} as const;

// Global contract client registry
const contractClients: Map<string, ContractClient> = new Map();

export function registerContractClient(name: string, client: ContractClient): void {
  contractClients.set(name, client);
}

export function getContractClient(name: string): ContractClient | undefined {
  return contractClients.get(name);
}

export function getAllContractClients(): Map<string, ContractClient> {
  return new Map(contractClients);
}

// Initialize default clients
registerContractClient("USDC", INJECTIVE_CONTRACT_CLIENTS.USDC);
registerContractClient("BOUNTY_CAMPAIGN", INJECTIVE_CONTRACT_CLIENTS.BOUNTY_CAMPAIGN);

// Convenience functions
export function encodeContractCall(name: string, functionName: string, params: unknown[]): ContractCall | null {
  const client = getContractClient(name);
  if (!client) return null;
  return client.createCall(functionName, params);
}

export function getContractAddress(name: string): string | null {
  return getContractClient(name)?.getAddress() ?? null;
}
