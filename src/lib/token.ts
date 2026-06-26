/**
 * Token utilities
 */

interface Token {
  id: string;
  symbol: string;
  name: string;
  decimals: number;
  address?: string;
  chainId: number;
  logoUrl?: string;
  price?: number;
  balance?: bigint;
}

class TokenRegistry {
  private tokens: Map<string, Token> = new Map();

  register(token: Token): void {
    const key = this.getKey(token.chainId, token.address || token.symbol);
    this.tokens.set(key, token);
  }

  unregister(chainId: number, addressOrSymbol: string): void {
    this.tokens.delete(this.getKey(chainId, addressOrSymbol));
  }

  get(chainId: number, addressOrSymbol: string): Token | undefined {
    return this.tokens.get(this.getKey(chainId, addressOrSymbol));
  }

  getBySymbol(symbol: string): Token[] {
    return Array.from(this.tokens.values()).filter((t) => t.symbol === symbol);
  }

  getByChain(chainId: number): Token[] {
    return Array.from(this.tokens.values()).filter((t) => t.chainId === chainId);
  }

  getAll(): Token[] {
    return Array.from(this.tokens.values());
  }

  private getKey(chainId: number, addressOrSymbol: string): string {
    return `${chainId}:${addressOrSymbol.toLowerCase()}`;
  }

  clear(): void {
    this.tokens.clear();
  }
}

export function createTokenRegistry(): TokenRegistry {
  return new TokenRegistry();
}

export function createToken(
  symbol: string,
  name: string,
  decimals: number,
  chainId: number,
  options?: Partial<Omit<Token, "id" | "symbol" | "name" | "decimals" | "chainId">>
): Token {
  return {
    id: crypto.randomUUID(),
    symbol,
    name,
    decimals,
    chainId,
    ...options,
  };
}

// Format utilities
export function formatTokenAmount(amount: bigint, decimals: number, displayDecimals: number = 4): string {
  const divisor = BigInt(10 ** decimals);
  const wholePart = amount / divisor;
  const fractionalPart = amount % divisor;
  const fractionalStr = fractionalPart.toString().padStart(decimals, "0").slice(0, displayDecimals);
  return `${wholePart.toLocaleString()}.${fractionalStr}`;
}

export function parseTokenAmount(amount: string, decimals: number): bigint {
  const [whole, fraction = ""] = amount.split(".");
  const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(whole) * BigInt(10 ** decimals) + BigInt(paddedFraction);
}

export function formatUsdValue(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatTokenPrice(price: number): string {
  if (price < 0.01) {
    return `$${price.toFixed(6)}`;
  }
  if (price < 1) {
    return `$${price.toFixed(4)}`;
  }
  return `$${price.toFixed(2)}`;
}

// Global token registry
let globalTokenRegistry: TokenRegistry | null = null;

export function getGlobalTokenRegistry(): TokenRegistry {
  if (!globalTokenRegistry) {
    globalTokenRegistry = createTokenRegistry();
  }
  return globalTokenRegistry;
}

export function setGlobalTokenRegistry(registry: TokenRegistry): void {
  globalTokenRegistry = registry;
}

// Convenience functions
export function registerToken(token: Token): void {
  getGlobalTokenRegistry().register(token);
}

export function getToken(chainId: number, addressOrSymbol: string): Token | undefined {
  return getGlobalTokenRegistry().get(chainId, addressOrSymbol);
}

export function getTokensByChain(chainId: number): Token[] {
  return getGlobalTokenRegistry().getByChain(chainId);
}

export function getAllTokens(): Token[] {
  return getGlobalTokenRegistry().getAll();
}
