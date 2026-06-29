import { formatUnits } from "viem";

export function shortenAddress(addr: string) {
  return addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "";
}

export function formatUSDC(v: bigint): string {
  return formatUnits(v, 6);
}

export function getTimeRemaining(deadline: number): string {
  const now = Math.floor(Date.now() / 1000);
  const remaining = deadline - now;
  if (remaining <= 0) return "Ended";
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  if (days > 0) return `${days}d ${hours}h`;
  const minutes = Math.floor((remaining % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function getCampaignStatus(deadline: number, settled: boolean): "active" | "voting" | "ended" {
  if (settled) return "ended";
  const now = Math.floor(Date.now() / 1000);
  if (now >= deadline) return "voting";
  return "active";
}
