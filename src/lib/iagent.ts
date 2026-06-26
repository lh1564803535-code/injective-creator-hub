/**
 * iAgent SDK Integration Layer
 *
 * Provides a TypeScript interface for interacting with Injective's iAgent SDK.
 * In production, this would connect to the iAgent Python backend.
 * For demo purposes, we use mock responses that showcase the capabilities.
 */

export interface AgentConfig {
  name: string;
  type: string;
  description: string;
  wallet: string;
  network: "testnet" | "mainnet";
}

export interface AgentResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export interface TradingCommand {
  action: "buy" | "sell" | "swap" | "transfer";
  asset: string;
  amount: number;
  target?: string;
}

// Mock agent registry
const registeredAgents: Map<string, AgentConfig> = new Map();

/**
 * Register a new AI agent on Injective
 */
export async function registerAgent(config: AgentConfig): Promise<AgentResponse> {
  // In production: calls iAgent Python backend
  // For demo: mock registration
  const agentId = `agent_${Date.now()}`;

  registeredAgents.set(agentId, {
    ...config,
    network: config.network || "testnet",
  });

  return {
    success: true,
    message: `Agent "${config.name}" registered successfully on Injective ${config.network}`,
    data: {
      agentId,
      address: config.wallet,
      network: config.network,
      identityRegistry: config.network === "testnet"
        ? "0x8004A818BFB912233c491871b3d84c89A494BD9e"
        : "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432",
    },
  };
}

/**
 * Execute a natural language command via iAgent
 */
export async function executeCommand(
  command: string,
  wallet?: string
): Promise<AgentResponse> {
  const lower = command.toLowerCase();

  // Payment commands
  if (/send|transfer|pay/.test(lower)) {
    return {
      success: true,
      message: "Payment command received. Ready to execute on Injective.",
      data: {
        action: "transfer",
        estimatedGas: "0.001 INJ",
        speed: "instant (< 1s)",
      },
    };
  }

  // Trading commands
  if (/buy|sell|swap|trade/.test(lower)) {
    return {
      success: true,
      message: "Trading command received. Ready to execute on Injective DEX.",
      data: {
        action: "trade",
        supportedPairs: ["INJ/USDC", "USDC/USDT", "ETH/USDC"],
        estimatedSlippage: "0.1%",
      },
    };
  }

  // Balance check
  if (/balance|how much|portfolio/.test(lower)) {
    return {
      success: true,
      message: "Fetching portfolio data from Injective.",
      data: {
        balances: {
          INJ: "125.50",
          USDC: "1,245.67",
          USDT: "500.00",
        },
        totalValue: "$2,870.17",
      },
    };
  }

  // Market data
  if (/market|price|trend/.test(lower)) {
    return {
      success: true,
      message: "Fetching real-time market data from Injective.",
      data: {
        INJ: { price: "$24.85", change: "+3.2%" },
        volume24h: "$1.2B",
        activePairs: 156,
      },
    };
  }

  return {
    success: true,
    message: "Command processed. Available actions: send, trade, balance, market.",
  };
}

/**
 * Get agent status and capabilities
 */
export async function getAgentStatus(agentId?: string): Promise<AgentResponse> {
  return {
    success: true,
    message: "Agent is active and ready.",
    data: {
      status: "active",
      network: "testnet",
      capabilities: [
        "Natural language trading",
        "Portfolio management",
        "Market analysis",
        "Cross-chain transfers",
      ],
      uptime: "99.9%",
      lastActive: new Date().toISOString(),
    },
  };
}

/**
 * Get list of registered agents
 */
export function listAgents(): AgentConfig[] {
  return Array.from(registeredAgents.values());
}
