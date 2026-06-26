"use client";

import { Users, TrendingUp, Shield, ExternalLink } from "lucide-react";

interface CopyTradeCardProps {
  traderName: string;
  traderAddress: string;
  winRate: number;
  totalTrades: number;
  pnl30d: number;
  followers: number;
  onCopy?: () => void;
  className?: string;
}

export function CopyTradeCard({
  traderName,
  traderAddress,
  winRate,
  totalTrades,
  pnl30d,
  followers,
  onCopy,
  className = "",
}: CopyTradeCardProps) {
  const shortAddress = `${traderAddress.slice(0, 6)}...${traderAddress.slice(-4)}`;
  const isPositivePnl = pnl30d >= 0;

  return (
    <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 ${className}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
            {traderName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{traderName}</p>
            <p className="text-xs text-gray-500">{shortAddress}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 ${isPositivePnl ? "text-emerald-400" : "text-red-400"}`}>
          <TrendingUp className="h-3.5 w-3.5" />
          <span className="text-sm font-bold">{isPositivePnl ? "+" : ""}{pnl30d.toFixed(2)}%</span>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-white/[0.04] p-2 text-center">
          <p className="text-[10px] text-gray-500">Win Rate</p>
          <p className="text-sm font-medium text-white">{winRate}%</p>
        </div>
        <div className="rounded-lg bg-white/[0.04] p-2 text-center">
          <p className="text-[10px] text-gray-500">Trades</p>
          <p className="text-sm font-medium text-white">{totalTrades}</p>
        </div>
        <div className="rounded-lg bg-white/[0.04] p-2 text-center">
          <p className="text-[10px] text-gray-500">Followers</p>
          <p className="text-sm font-medium text-white">{followers}</p>
        </div>
      </div>

      <button
        onClick={onCopy}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 py-2 text-sm font-medium text-white transition hover:bg-cyan-500"
      >
        <Users className="h-4 w-4" />
        Copy Trader
      </button>
    </div>
  );
}
