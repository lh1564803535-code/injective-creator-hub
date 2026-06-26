/**
 * Indexer utilities
 */

interface IndexedData {
  id: string;
  type: string;
  data: Record<string, unknown>;
  blockNumber: number;
  timestamp: number;
}

class Indexer {
  private index: Map<string, IndexedData[]> = new Map();
  private listeners: Set<(data: IndexedData) => void> = new Set();

  index(data: IndexedData): void {
    const key = this.getKey(data.type, data.blockNumber);
    if (!this.index.has(key)) {
      this.index.set(key, []);
    }
    this.index.get(key)!.push(data);

    this.listeners.forEach((listener) => {
      try {
        listener(data);
      } catch (error) {
        console.error("Error in indexer listener:", error);
      }
    });
  }

  query(options: {
    type?: string;
    fromBlock?: number;
    toBlock?: number;
    limit?: number;
  }): IndexedData[] {
    let results: IndexedData[] = [];

    for (const [key, data] of this.index) {
      const [type, blockStr] = key.split(":");
      const blockNumber = parseInt(blockStr);

      if (options.type && type !== options.type) continue;
      if (options.fromBlock && blockNumber < options.fromBlock) continue;
      if (options.toBlock && blockNumber > options.toBlock) continue;

      results.push(...data);
    }

    results.sort((a, b) => b.blockNumber - a.blockNumber);

    if (options.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  getLatest(type: string): IndexedData | undefined {
    const results = this.query({ type, limit: 1 });
    return results[0];
  }

  subscribe(listener: (data: IndexedData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private getKey(type: string, blockNumber: number): string {
    return `${type}:${blockNumber}`;
  }

  clear(): void {
    this.index.clear();
  }

  getSize(): number {
    let size = 0;
    for (const data of this.index.values()) {
      size += data.length;
    }
    return size;
  }
}

export function createIndexer(): Indexer {
  return new Indexer();
}

export function createIndexedData(
  type: string,
  data: Record<string, unknown>,
  blockNumber: number
): IndexedData {
  return {
    id: crypto.randomUUID(),
    type,
    data,
    blockNumber,
    timestamp: Date.now(),
  };
}

// Global indexer
let globalIndexer: Indexer | null = null;

export function getGlobalIndexer(): Indexer {
  if (!globalIndexer) {
    globalIndexer = createIndexer();
  }
  return globalIndexer;
}

export function setGlobalIndexer(indexer: Indexer): void {
  globalIndexer = indexer;
}

// Convenience functions
export function indexData(type: string, data: Record<string, unknown>, blockNumber: number): void {
  getGlobalIndexer().index(createIndexedData(type, data, blockNumber));
}

export function queryIndex(options: Parameters<Indexer["query"]>[0]): IndexedData[] {
  return getGlobalIndexer().query(options);
}

export function getLatestIndexed(type: string): IndexedData | undefined {
  return getGlobalIndexer().getLatest(type);
}

export function onIndexUpdate(listener: (data: IndexedData) => void): () => void {
  return getGlobalIndexer().subscribe(listener);
}
