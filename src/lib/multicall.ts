/**
 * Multicall utilities
 */

interface MulticallRequest {
  to: string;
  data: string;
}

interface MulticallResponse {
  success: boolean;
  returnData: string;
}

class MulticallClient {
  private multicallAddress: string;
  private chainId: number;

  constructor(multicallAddress: string, chainId: number) {
    this.multicallAddress = multicallAddress;
    this.chainId = chainId;
  }

  async aggregate(calls: MulticallRequest[]): Promise<MulticallResponse[]> {
    // Simplified implementation
    // In production: use ethers.js Multicall contract
    const results: MulticallResponse[] = [];

    for (const call of calls) {
      try {
        // Mock execution
        results.push({
          success: true,
          returnData: "0x" + "0".repeat(64),
        });
      } catch {
        results.push({
          success: false,
          returnData: "0x",
        });
      }
    }

    return results;
  }

  async aggregate3(calls: Array<{ target: string; callData: string; allowFailure: boolean }>): Promise<MulticallResponse[]> {
    const results: MulticallResponse[] = [];

    for (const call of calls) {
      try {
        results.push({
          success: true,
          returnData: "0x" + "0".repeat(64),
        });
      } catch {
        if (call.allowFailure) {
          results.push({
            success: false,
            returnData: "0x",
          });
        } else {
          throw new Error(`Multicall failed for ${call.target}`);
        }
      }
    }

    return results;
  }

  getMulticallAddress(): string {
    return this.multicallAddress;
  }

  getChainId(): number {
    return this.chainId;
  }
}

export function createMulticallClient(address: string, chainId: number): MulticallClient {
  return new MulticallClient(address, chainId);
}

// Multicall3 address (standard across EVM chains)
export const MULTICALL3_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11";

// Pre-configured multicall clients
export const MULTICALL_CLIENTS = {
  TESTNET: createMulticallClient(MULTICALL3_ADDRESS, 1439),
  MAINNET: createMulticallClient(MULTICALL3_ADDRESS, 2525),
} as const;

// Global multicall client
let globalMulticallClient: MulticallClient | null = null;

export function getGlobalMulticallClient(): MulticallClient {
  if (!globalMulticallClient) {
    globalMulticallClient = MULTICALL_CLIENTS.TESTNET;
  }
  return globalMulticallClient;
}

export function setGlobalMulticallClient(client: MulticallClient): void {
  globalMulticallClient = client;
}

// Convenience functions
export async function multicall(calls: MulticallRequest[]): Promise<MulticallResponse[]> {
  return getGlobalMulticallClient().aggregate(calls);
}

export async function multicall3(calls: Array<{ target: string; callData: string; allowFailure: boolean }>): Promise<MulticallResponse[]> {
  return getGlobalMulticallClient().aggregate3(calls);
}

// Batch balance check
export async function batchBalanceOf(
  tokenAddress: string,
  addresses: string[]
): Promise<Map<string, bigint>> {
  const calls: MulticallRequest[] = addresses.map((address) => ({
    to: tokenAddress,
    data: `0x70a08231${address.slice(2).padStart(64, "0")}`, // balanceOf(address)
  }));

  const results = await multicall(calls);
  const balances = new Map<string, bigint>();

  addresses.forEach((address, index) => {
    if (results[index]?.success) {
      balances.set(address, BigInt(results[index].returnData));
    } else {
      balances.set(address, 0n);
    }
  });

  return balances;
}

// Build multicall request
export function buildMulticallRequest(to: string, data: string): MulticallRequest {
  return { to, data };
}

// Encode multicall
export function encodeMulticall(calls: MulticallRequest[]): string {
  // Simplified encoding
  const encoded = calls.map((call) => `${call.to}:${call.data}`).join("|");
  return `0x${Buffer.from(encoded).toString("hex")}`;
}
