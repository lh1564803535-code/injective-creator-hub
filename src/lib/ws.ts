/**
 * WebSocket utilities
 */

interface WsConfig {
  url: string;
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

type WsMessageHandler = (data: unknown) => void;

class WsClient {
  private ws: WebSocket | null = null;
  private config: WsConfig;
  private handlers: Map<string, Set<WsMessageHandler>> = new Map();
  private reconnectAttempts: number = 0;
  private isConnected: boolean = false;

  constructor(config: WsConfig) {
    this.config = {
      reconnect: true,
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      ...config,
    };
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config.url);

        this.ws.onopen = () => {
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.emit("open", null);
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.emit("message", data);

            if (data.type) {
              this.emit(data.type, data);
            }
          } catch {
            this.emit("message", event.data);
          }
        };

        this.ws.onclose = () => {
          this.isConnected = false;
          this.emit("close", null);

          if (this.config.reconnect && this.reconnectAttempts < (this.config.maxReconnectAttempts || 10)) {
            setTimeout(() => {
              this.reconnectAttempts++;
              this.connect();
            }, this.config.reconnectInterval);
          }
        };

        this.ws.onerror = (error) => {
          this.emit("error", error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.config.reconnect = false;
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  send(data: unknown): void {
    if (!this.ws || !this.isConnected) {
      throw new Error("WebSocket not connected");
    }
    this.ws.send(typeof data === "string" ? data : JSON.stringify(data));
  }

  on(event: string, handler: WsMessageHandler): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
    return () => this.handlers.get(event)?.delete(handler);
  }

  private emit(event: string, data: unknown): void {
    this.handlers.get(event)?.forEach((handler) => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in WebSocket handler for "${event}":`, error);
      }
    });
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }

  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }
}

export function createWsClient(config: WsConfig): WsClient {
  return new WsClient(config);
}

// Injective WebSocket endpoints
export const INJECTIVE_WS_ENDPOINTS = {
  TESTNET: "wss://k8s.testnet.json-rpc.injective.network/ws",
  MAINNET: "wss://k8s.global.mainnet.lcd.injective.network/ws",
} as const;

// Global WebSocket client
let globalWsClient: WsClient | null = null;

export function getGlobalWsClient(): WsClient {
  if (!globalWsClient) {
    globalWsClient = createWsClient({
      url: INJECTIVE_WS_ENDPOINTS.TESTNET,
      reconnect: true,
    });
  }
  return globalWsClient;
}

export function setGlobalWsClient(client: WsClient): void {
  globalWsClient = client;
}

// Convenience functions
export async function connectWs(): Promise<void> {
  return getGlobalWsClient().connect();
}

export function disconnectWs(): void {
  getGlobalWsClient().disconnect();
}

export function sendWsMessage(data: unknown): void {
  getGlobalWsClient().send(data);
}

export function onWsMessage(handler: WsMessageHandler): () => void {
  return getGlobalWsClient().on("message", handler);
}

export function isWsConnected(): boolean {
  return getGlobalWsClient().getIsConnected();
}
