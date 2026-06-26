"use client";

import { TrendingUp, TrendingDown, Shield, ArrowUpRight } from "lucide-react";

interface LendingPool {
  asset: symbol;
  supplyApy: number;
  borrowApy: number;
  totalSupply: string;
  totalBorrow: string;
  utilization: number;
  ltv: number;
}

interface LendingCardProps {
  pool: LendingPool;
  userSupply?: string;
  userBorrow?: string;
  onSupply?: () => void;
  onBorrow?: () => void;
  className?: string;
}

export function LendingCard({
  pool,
  userSupply,
  userBorrow,
  onSupply,
  onBorrow,
  className = "",
}: LendingCardProps) {
  const hasPosition = userSupply || userBorrow;

  return (
    <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
            {pool.asset.slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{pool.asset}</p>
            <p className="text-xs text-gray-500">LTV: {pool.ltv}%</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Shield className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-xs text-emerald-400">Audited</span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-emerald-500/5 p-2 text-center">
          <p className="text-[10px] text-gray-500">Supply APY</p>
          <p className="text-sm font-bold text-emerald-400">{pool.supplyApy}%</p>
        </div>
        <div className="rounded-lg bg-amber-500/5 p-2 text-center">
          <p className="text-[10px] text-gray-500">Borrow APY</p>
          <p className="text-sm font-bold text-amber-400">{pool.borrowApy}%</p>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Total Supply</span>
          <span className="text-white">{pool.totalSupply}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Total Borrow</span>
          <span className="text-white">{pool.totalBorrow}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Utilization</span>
          <span className="text-white">{pool.utilization}%</span>
        </div>
      </div>

      {hasPosition && (
        <div className="mb-4 space-y-2 rounded-lg bg-white/[0.02] p-3">
          {userSupply && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400">Your Supply</span>
              <span className="text-white">{userSupply}</span>
            </div>
          )}
          {userBorrow && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-400">Your Borrow</span>
              <span className="text-white">{userBorrow}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onSupply}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-600 py-2 text-xs font-medium text-white transition hover:bg-emerald-500"
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Supply
        </button>
        <button
          onClick={onBorrow}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-amber-600 py-2 text-xs font-medium text-white transition hover:bg-amber-500"
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
          Borrow
        </button>
      </div>
    </div>
  );
}
