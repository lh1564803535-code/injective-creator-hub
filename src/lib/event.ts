/**
 * Event utilities (blockchain events)
 */

interface BlockchainEvent {
  id: string;
  name: string;
  address: string;
  chainId: number;
  blockNumber: number;
  transactionHash: string;
  args: Record<string, unknown>;
  timestamp: number;
}

class BlockchainEventManager {
  private events: BlockchainEvent[] = [];
  private listeners: Map<string, Set<(event: BlockchainEvent) => void>> = new Map();
  private maxEvents: number = 10000;

  addEvent(event: BlockchainEvent): void {
    this.events.push(event);

    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Notify specific event listeners
    this.listeners.get(event.name)?.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error(`Error in event listener for "${event.name}":`, error);
      }
    });

    // Notify wildcard listeners
    this.listeners.get("*")?.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error("Error in wildcard event listener:", error);
      }
    });
  }

  on(eventName: string, listener: (event: BlockchainEvent) => void): () => void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)!.add(listener);
    return () => this.listeners.get(eventName)?.delete(listener);
  }

  getEvents(filter?: {
    name?: string;
    address?: string;
    chainId?: number;
    fromBlock?: number;
    toBlock?: number;
  }): BlockchainEvent[] {
    let filtered = [...this.events];

    if (filter?.name) {
      filtered = filtered.filter((e) => e.name === filter.name);
    }
    if (filter?.address) {
      filtered = filtered.filter((e) => e.address.toLowerCase() === filter.address!.toLowerCase());
    }
    if (filter?.chainId) {
      filtered = filtered.filter((e) => e.chainId === filter.chainId);
    }
    if (filter?.fromBlock) {
      filtered = filtered.filter((e) => e.blockNumber >= filter.fromBlock!);
    }
    if (filter?.toBlock) {
      filtered = filtered.filter((e) => e.blockNumber <= filter.toBlock!);
    }

    return filtered;
  }

  getEventsByName(name: string): BlockchainEvent[] {
    return this.getEvents({ name });
  }

  getEventsByAddress(address: string): BlockchainEvent[] {
    return this.getEvents({ address });
  }

  clear(): void {
    this.events = [];
  }

  getEventCount(): number {
    return this.events.length;
  }
}

export function createBlockchainEventManager(): BlockchainEventManager {
  return new BlockchainEventManager();
}

export function createBlockchainEvent(
  name: string,
  address: string,
  chainId: number,
  blockNumber: number,
  transactionHash: string,
  args: Record<string, unknown>
): BlockchainEvent {
  return {
    id: crypto.randomUUID(),
    name,
    address,
    chainId,
    blockNumber,
    transactionHash,
    args,
    timestamp: Date.now(),
  };
}

// Global blockchain event manager
let globalBlockchainEventManager: BlockchainEventManager | null = null;

export function getGlobalBlockchainEventManager(): BlockchainEventManager {
  if (!globalBlockchainEventManager) {
    globalBlockchainEventManager = createBlockchainEventManager();
  }
  return globalBlockchainEventManager;
}

export function setGlobalBlockchainEventManager(manager: BlockchainEventManager): void {
  globalBlockchainEventManager = manager;
}

// Convenience functions
export function addBlockchainEvent(event: BlockchainEvent): void {
  getGlobalBlockchainEventManager().addEvent(event);
}

export function onBlockchainEvent(eventName: string, listener: (event: BlockchainEvent) => void): () => void {
  return getGlobalBlockchainEventManager().on(eventName, listener);
}

export function getBlockchainEvents(filter?: Parameters<BlockchainEventManager["getEvents"]>[0]): BlockchainEvent[] {
  return getGlobalBlockchainEventManager().getEvents(filter);
}

export function getBlockchainEventsByName(name: string): BlockchainEvent[] {
  return getGlobalBlockchainEventManager().getEventsByName(name);
}

export function getBlockchainEventsByAddress(address: string): BlockchainEvent[] {
  return getGlobalBlockchainEventManager().getEventsByAddress(address);
}
