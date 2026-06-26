/**
 * ERC20 utilities
 */

interface ERC20Info {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply?: bigint;
}

class ERC20Client {
  private info: ERC20Info;
  private balanceCache: Map<string, { balance: bigint; timestamp: number }> = new Map();
  private cacheTtl: number = 30000; // 30 seconds

  constructor(info: ERC20Info) {
    this.info = info;
  }

  getAddress(): string {
    return this.info.address;
  }

  getName(): string {
    return this.info.name;
  }

  getSymbol(): string {
    return this.info.symbol;
  }

  getDecimals(): number {
    return this.info.decimals;
  }

  formatAmount(amount: bigint, displayDecimals: number = 4): string {
    const divisor = BigInt(10 ** this.info.decimals);
    const wholePart = amount / divisor;
    const fractionalPart = amount % divisor;
    const fractionalStr = fractionalPart.toString().padStart(this.info.decimals, "0").slice(0, displayDecimals);
    return `${wholePart.toLocaleString()}.${fractionalStr}`;
  }

  parseAmount(amount: string): bigint {
    const [whole, fraction = ""] = amount.split(".");
    const paddedFraction = fraction.padEnd(this.info.decimals, "0").slice(0, this.info.decimals);
    return BigInt(whole) * BigInt(10 ** this.info.decimals) + BigInt(paddedFraction);
  }

  formatUsdValue(amount: bigint, pricePerToken: number): string {
    const tokenAmount = Number(amount) / 10 ** this.info.decimals;
    const usdValue = tokenAmount * pricePerToken;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(usdValue);
  }

  getBalanceFromCache(address: string): bigint | null {
    const cached = this.balanceCache.get(address);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > this.cacheTtl) {
      this.balanceCache.delete(address);
      return null;
    }
    return cached.balance;
  }

  setBalanceCache(address: string, balance: bigint): void {
    this.balanceCache.set(address, { balance, timestamp: Date.now() });
  }

  clearCache(): void {
    this.balanceCache.clear();
  }
}

export function createERC20Client(info: ERC20Info): ERC20Client {
  return new ERC20Client(info);
}

// Pre-configured ERC20 clients
export const ERC20_TOKENS = {
  USDC: createERC20Client({
    address: "0xf22bede237a07e121b56d91a491eb7bcdfd1f590",
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
  }),
  USDT: createERC20Client({
    address: "0x0000000000000000000000000000000000000000", // Placeholder
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6,
  }),
} as const;

// Global ERC20 client registry
const erc20Clients: Map<string, ERC20Client> = new Map();

export function registerERC20Client(name: string, client: ERC20Client): void {
  erc20Clients.set(name, client);
}

export function getERC20Client(name: string): ERC20Client | undefined {
  return erc20Clients.get(name);
}

export function getAllERC20Clients(): Map<string, ERC20Client> {
  return new Map(erc20Clients);
}

// Initialize default clients
registerERC20Client("USDC", ERC20_TOKENS.USDC);
registerERC20Client("USDT", ERC20_TOKENS.USDT);

// Convenience functions
export function formatTokenAmount(tokenName: string, amount: bigint, displayDecimals?: number): string {
  const client = getERC20Client(tokenName);
  if (!client) return amount.toString();
  return client.formatAmount(amount, displayDecimals);
}

export function parseTokenAmount(tokenName: string, amount: string): bigint | null {
  const client = getERC20Client(tokenName);
  if (!client) return null;
  return client.parseAmount(amount);
}

export function formatTokenUsdValue(tokenName: string, amount: bigint, pricePerToken: number): string {
  const client = getERC20Client(tokenName);
  if (!client) return "$0.00";
  return client.formatUsdValue(amount, pricePerToken);
}

// Common token prices (for demo purposes)
export const TOKEN_PRICES: Record<string, number> = {
  USDC: 1.0,
  USDT: 1.0,
  INJ: 24.85,
  ETH: 3500,
};

export function getTokenPrice(symbol: string): number {
  return TOKEN_PRICES[symbol] ?? 0;
}
