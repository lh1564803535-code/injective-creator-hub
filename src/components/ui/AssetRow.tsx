"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

interface AssetRowProps {
  symbol: string;
  name: string;
  balance: string;
  value: number;
  change24h: number;
  icon?: string;
  className?: string;
}

export function AssetRow({
  symbol,
  name,
  balance,
  value,
  change24h,
  icon,
  className = "",
}: AssetRowProps) {
  const isPositive = change24h >= 0;

  return (
    <div className={`flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-white/[0.04] ${className}`}>
      {/* Icon */}
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-xs font-bold text-white">
        {icon ? (
          <img src={icon} alt={symbol} className="h-full w-full rounded-full" />
        ) : (
          symbol.slice(0, 2)
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{symbol}</p>
        <p className="text-xs text-gray-500">{name}</p>
      </div>

      {/* Balance */}
      <div className="text-right">
        <p className="text-sm font-medium text-white">{balance}</p>
        <p className="text-xs text-gray-500">${value.toLocaleString()}</p>
      </div>

      {/* Change */}
      <div className={`flex items-center gap-0.5 ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        <span className="text-xs">{isPositive ? "+" : ""}{change24h.toFixed(2)}%</span>
      </div>
    </div>
  );
}
