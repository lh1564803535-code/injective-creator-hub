"use client";

import { Wallet, Shield, Users, TrendingUp } from "lucide-react";

interface TreasuryAsset {
  symbol: string;
  amount: string;
  value: number;
  change24h: number;
}

interface TreasuryCardProps {
  name: string;
  totalValue: number;
  assets: TreasuryAsset[];
  signers?: number;
  threshold?: number;
  className?: string;
}

export function TreasuryCard({
  name,
  totalValue,
  assets,
  signers,
  threshold,
  className = "",
}: TreasuryCardProps) {
  return (
    <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-cyan-400" />
          <span className="text-sm font-medium text-white">{name}</span>
        </div>
        {signers && threshold && (
          <div className="flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5">
            <Users className="h-3 w-3 text-purple-400" />
            <span className="text-[10px] font-medium text-purple-400">
              {threshold}/{signers} Multi-sig
            </span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</p>
        <p className="text-xs text-gray-500">Total Value</p>
      </div>

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
                <TrendingUp className="h-3 w-3" />
                <span>{asset.change24h >= 0 ? "+" : ""}{asset.change24h}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
