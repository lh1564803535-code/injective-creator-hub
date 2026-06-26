/**
 * Indexer Client utilities
 */

interface IndexerConfig {
  endpoint: string;
  apiKey?: string;
  timeout?: number;
}

interface IndexedBlock {
  number: number;
  hash: string;
  timestamp: number;
  parentHash: string;
}

interface IndexedTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: number;
  timestamp: number;
  status: "success" | "failed";
}

class IndexerClient {
  private config: IndexerConfig;

  constructor(config: IndexerConfig) {
    this.config = config;
  }

  async getBlock(blockNumber: number): Promise<IndexedBlock> {
    const response = await this.fetch(`/blocks/${blockNumber}`);
    return response as IndexedBlock;
  }

  async getLatestBlock(): Promise<IndexedBlock> {
    const response = await this.fetch("/blocks/latest");
    return response as IndexedBlock;
  }

  async getTransaction(hash: string): Promise<IndexedTransaction> {
    const response = await this.fetch(`/transactions/${hash}`);
    return response as IndexedTransaction;
  }

  async getTransactions(options?: {
    from?: string;
    to?: string;
    fromBlock?: number;
    toBlock?: number;
    limit?: number;
  }): Promise<IndexedTransaction[]> {
    const params = new URLSearchParams();
    if (options?.from) params.set("from", options.from);
    if (options?.to) params.set("to", options.to);
    if (options?.fromBlock) params.set("fromBlock", String(options.fromBlock));
    if (options?.toBlock) params.set("toBlock", String(options.toBlock));
    if (options?.limit) params.set("limit", String(options.limit));

    const response = await this.fetch(`/transactions?${params.toString()}`);
    return response as IndexedTransaction[];
  }

  async getAddressTransactions(address: string, limit?: number): Promise<IndexedTransaction[]> {
    return this.getTransactions({ from: address, limit });
  }

  async getBalance(address: string): Promise<string> {
    const response = await this.fetch(`/addresses/${address}/balance`);
    return (response as { balance: string }).balance;
  }

  private async fetch(path: string): Promise<unknown> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.config.apiKey) {
      headers["Authorization"] = `Bearer ${this.config.apiKey}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.config.timeout || 10000
    );

    try {
      const response = await fetch(`${this.config.endpoint}${path}`, {
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Indexer request failed: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  getEndpoint(): string {
    return this.config.endpoint;
  }

  setEndpoint(endpoint: string): void {
    this.config.endpoint = endpoint;
  }
}

export function createIndexerClient(config: IndexerConfig): IndexerClient {
  return new IndexerClient(config);
}

// Injective indexer endpoints
export const INJECTIVE_INDEXER_ENDPOINTS = {
  TESTNET: "https://testnet.api.injective.dev",
  MAINNET: "https://api.injective.dev",
} as const;

// Global indexer client
let globalIndexerClient: IndexerClient | null = null;

export function getGlobalIndexerClient(): IndexerClient {
  if (!globalIndexerClient) {
    globalIndexerClient = createIndexerClient({
      endpoint: INJECTIVE_INDEXER_ENDPOINTS.TESTNET,
    });
  }
  return globalIndexerClient;
}

export function setGlobalIndexerClient(client: IndexerClient): void {
  globalIndexerClient = client;
}

// Convenience functions
export async function getBlock(blockNumber: number): Promise<IndexedBlock> {
  return getGlobalIndexerClient().getBlock(blockNumber);
}

export async function getLatestBlock(): Promise<IndexedBlock> {
  return getGlobalIndexerClient().getLatestBlock();
}

export async function getTransaction(hash: string): Promise<IndexedTransaction> {
  return getGlobalIndexerClient().getTransaction(hash);
}

export async function getAddressTransactions(address: string, limit?: number): Promise<IndexedTransaction[]> {
  return getGlobalIndexerClient().getAddressTransactions(address, limit);
}

export async function getAddressBalance(address: string): Promise<string> {
  return getGlobalIndexerClient().getBalance(address);
}
