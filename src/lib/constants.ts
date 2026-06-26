/**
 * Application constants
 */

// Network Configuration
export const NETWORK = {
  TESTNET: {
    chainId: 1439,
    name: "Injective EVM Testnet",
    rpc: "https://k8s.testnet.json-rpc.injective.network/",
    explorer: "https://testnet.blockscout.injective.network/",
    currency: { name: "INJ", symbol: "INJ", decimals: 18 },
  },
  MAINNET: {
    chainId: 2525,
    name: "Injective EVM Mainnet",
    rpc: "https://k8s.global.mainnet.lcd.injective.network",
    explorer: "https://explorer.injective.network",
    currency: { name: "INJ", symbol: "INJ", decimals: 18 },
  },
} as const;

// Contract Addresses
export const CONTRACTS = {
  USDC: "0xf22bede237a07e121b56d91a491eb7bcdfd1f590",
  BOUNTY_CAMPAIGN: process.env.NEXT_PUBLIC_BOUNTY_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000",
} as const;

// UI Constants
export const UI = {
  MAX_CAMPAIGNS_PER_PAGE: 12,
  MAX_LEADERBOARD_PER_PAGE: 20,
  TOAST_DURATION: 5000,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
} as const;

// Gas Estimates
export const GAS = {
  VOTE: { gas: "0.001", usd: "0.02" },
  SUBMIT: { gas: "0.002", usd: "0.04" },
  CLAIM: { gas: "0.001", usd: "0.02" },
  TRANSFER: { gas: "0.001", usd: "0.02" },
  DEPLOY: { gas: "0.05", usd: "1.00" },
} as const;

// Feature Flags
export const FEATURES = {
  AI_ASSISTANT: true,
  REAL_TIME_STREAMING: true,
  TRANSACTION_PREVIEW: true,
  SOCIAL_FI: true,
  MCP_INTEGRATION: true,
} as const;

// Social Links
export const SOCIAL = {
  TWITTER: "https://twitter.com/Injective_",
  DISCORD: "https://discord.gg/injective",
  GITHUB: "https://github.com/InjectiveLabs",
  DOCS: "https://docs.injective.network",
} as const;

// Faucet Links
export const FAUCETS = [
  { name: "Official Faucet", url: "https://testnet.faucet.injective.network/" },
  { name: "Google Cloud", url: "https://cloud.google.com/application/web3/faucet/injective/testnet" },
] as const;
