"use client";

import { TrendingUp, TrendingDown, Wallet, ArrowUpRight } from "lucide-react";

interface Asset {
  symbol: string;
  amount: string;
  value: number;
  change24h: number;
}

interface PortfolioSummaryProps {
  totalValue: number;
  change24h: number;
  assets: Asset[];
  className?: string;
}

export function PortfolioSummary({
  totalValue,
  change24h,
  assets,
  className = "",
}: PortfolioSummaryProps) {
  const isPositive = change24h >= 0;

  return (
    <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 ${className}`}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-cyan-400" />
          <span className="text-sm font-medium text-white">Portfolio</span>
        </div>
        <div className={`flex items-center gap-1 ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
          {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          <span className="text-xs font-medium">{isPositive ? "+" : ""}{change24h.toFixed(2)}%</span>
        </div>
      </div>

      {/* Total */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</p>
        <p className="text-xs text-gray-500">Total Value</p>
      </div>

      {/* Assets */}
      <div className="space-y-2">
        {assets.map((asset, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2">
            <div>
              <p className="text-sm font-medium text-white">{asset.symbol}</p>
              <p className="text-xs text-gray-500">{asset.amount}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white">${asset.value.toLocaleString()}</p>
              <div className={`flex items-center justify-end gap-0.5 text-[10px] ${
                asset.change24h >= 0 ? "text-emerald-400" : "text-red-400"
              }`}>
                <ArrowUpRight className="h-3 w-3" />
                <span>{asset.change24h >= 0 ? "+" : ""}{asset.change24h}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
