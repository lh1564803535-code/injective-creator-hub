/**
 * Blockchain utilities
 */

import { NETWORK, CONTRACTS } from "./constants";

export function getNetworkConfig(chainId: number) {
  if (chainId === NETWORK.TESTNET.chainId) return NETWORK.TESTNET;
  if (chainId === NETWORK.MAINNET.chainId) return NETWORK.MAINNET;
  return null;
}

export function getExplorerUrl(hash: string, type: "tx" | "address" = "tx"): string {
  const base = NETWORK.TESTNET.explorer;
  return `${base}/${type}/${hash}`;
}

export function getExplorerAddressUrl(address: string): string {
  return getExplorerUrl(address, "address");
}

export function getExplorerTxUrl(hash: string): string {
  return getExplorerUrl(hash, "tx");
}

export function getFaucetUrl(): string {
  return "https://testnet.faucet.injective.network/";
}

export function getDocsUrl(): string {
  return "https://docs.injective.network";
}

export function formatGas(gas: string): string {
  return `${gas} INJ`;
}

export function formatGasUsd(usd: string): string {
  return `$${usd}`;
}

export function getGasSpeed(gas: string): string {
  const gasNum = parseFloat(gas);
  if (gasNum < 0.001) return "instant";
  if (gasNum < 0.01) return "fast";
  return "standard";
}

export function isTestnet(chainId: number): boolean {
  return chainId === NETWORK.TESTNET.chainId;
}

export function isMainnet(chainId: number): boolean {
  return chainId === NETWORK.MAINNET.chainId;
}
