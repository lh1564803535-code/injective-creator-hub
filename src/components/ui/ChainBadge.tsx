"use client";

import { Globe } from "lucide-react";

interface ChainBadgeProps {
  chainId: number;
  name?: string;
  className?: string;
}

const chainConfig: Record<number, { name: string; color: string }> = {
  1439: { name: "Injective Testnet", color: "text-cyan-400 bg-cyan-500/10" },
  2525: { name: "Injective Mainnet", color: "text-emerald-400 bg-emerald-500/10" },
  1: { name: "Ethereum", color: "text-blue-400 bg-blue-500/10" },
  137: { name: "Polygon", color: "text-purple-400 bg-purple-500/10" },
};

export function ChainBadge({
  chainId,
  name,
  className = "",
}: ChainBadgeProps) {
  const config = chainConfig[chainId] || { name: "Unknown", color: "text-gray-400 bg-gray-500/10" };
  const displayName = name || config.name;

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${config.color} ${className}`}>
      <Globe className="h-3 w-3" />
      <span className="text-[10px] font-medium">{displayName}</span>
    </div>
  );
}
