/**
 * RPC utilities
 */

interface RpcConfig {
  endpoint: string;
  chainId: number;
  timeout?: number;
}

interface RpcRequest {
  jsonrpc: "2.0";
  method: string;
  params?: unknown[];
  id: number;
}

interface RpcResponse<T = unknown> {
  jsonrpc: "2.0";
  result?: T;
  error?: { code: number; message: string };
  id: number;
}

class RpcClient {
  private config: RpcConfig;
  private requestId: number = 0;

  constructor(config: RpcConfig) {
    this.config = config;
  }

  async call<T>(method: string, params?: unknown[]): Promise<T> {
    const request: RpcRequest = {
      jsonrpc: "2.0",
      method,
      params,
      id: ++this.requestId,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.config.timeout || 10000
    );

    try {
      const response = await fetch(this.config.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`RPC request failed: ${response.statusText}`);
      }

      const result: RpcResponse<T> = await response.json();

      if (result.error) {
        throw new Error(`RPC error: ${result.error.message}`);
      }

      return result.result as T;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Common RPC methods
  async getBlockNumber(): Promise<number> {
    const result = await this.call<string>("eth_blockNumber");
    return parseInt(result, 16);
  }

  async getBalance(address: string, blockTag: string = "latest"): Promise<bigint> {
    const result = await this.call<string>("eth_getBalance", [address, blockTag]);
    return BigInt(result);
  }

  async getChainId(): Promise<number> {
    const result = await this.call<string>("eth_chainId");
    return parseInt(result, 16);
  }

  async getGasPrice(): Promise<bigint> {
    const result = await this.call<string>("eth_gasPrice");
    return BigInt(result);
  }

  async getTransactionCount(address: string, blockTag: string = "latest"): Promise<number> {
    const result = await this.call<string>("eth_getTransactionCount", [address, blockTag]);
    return parseInt(result, 16);
  }

  async sendRawTransaction(signedTx: string): Promise<string> {
    return this.call<string>("eth_sendRawTransaction", [signedTx]);
  }

  async getTransactionReceipt(hash: string): Promise<unknown> {
    return this.call("eth_getTransactionReceipt", [hash]);
  }

  async call_contract(to: string, data: string, blockTag: string = "latest"): Promise<string> {
    return this.call<string>("eth_call", [{ to, data }, blockTag]);
  }

  getEndpoint(): string {
    return this.config.endpoint;
  }

  getChainId_sync(): number {
    return this.config.chainId;
  }
}

export function createRpcClient(config: RpcConfig): RpcClient {
  return new RpcClient(config);
}

// Injective RPC endpoints
export const INJECTIVE_RPC_ENDPOINTS = {
  TESTNET: "https://k8s.testnet.json-rpc.injective.network/",
  MAINNET: "https://k8s.global.mainnet.lcd.injective.network",
} as const;

// Global RPC client
let globalRpcClient: RpcClient | null = null;

export function getGlobalRpcClient(): RpcClient {
  if (!globalRpcClient) {
    globalRpcClient = createRpcClient({
      endpoint: INJECTIVE_RPC_ENDPOINTS.TESTNET,
      chainId: 1439,
    });
  }
  return globalRpcClient;
}

export function setGlobalRpcClient(client: RpcClient): void {
  globalRpcClient = client;
}

// Convenience functions
export async function rpcCall<T>(method: string, params?: unknown[]): Promise<T> {
  return getGlobalRpcClient().call<T>(method, params);
}

export async function getBlockNumber(): Promise<number> {
  return getGlobalRpcClient().getBlockNumber();
}

export async function getBalance(address: string): Promise<bigint> {
  return getGlobalRpcClient().getBalance(address);
}

export async function getChainId(): Promise<number> {
  return getGlobalRpcClient().getChainId();
}

export async function getGasPrice(): Promise<bigint> {
  return getGlobalRpcClient().getGasPrice();
}

export async function getTransactionCount(address: string): Promise<number> {
  return getGlobalRpcClient().getTransactionCount(address);
}

export async function sendTransaction(signedTx: string): Promise<string> {
  return getGlobalRpcClient().sendRawTransaction(signedTx);
}

export async function getTransactionReceipt(hash: string): Promise<unknown> {
  return getGlobalRpcClient().getTransactionReceipt(hash);
}
