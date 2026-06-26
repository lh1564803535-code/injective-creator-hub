"use client";

import { Lock, Unlock, TrendingUp, Clock } from "lucide-react";

interface StakingPool {
  name: string;
  apy: number;
  tvl: string;
  lockPeriod: string;
  minStake: string;
  token: string;
}

interface StakingCardProps {
  pool: StakingPool;
  userStake?: string;
  onStake?: () => void;
  onUnstake?: () => void;
  className?: string;
}

export function StakingCard({
  pool,
  userStake,
  onStake,
  onUnstake,
  className = "",
}: StakingCardProps) {
  const hasStake = userStake && parseFloat(userStake) > 0;

  return (
    <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/15">
            {pool.lockPeriod === "None" ? (
              <Unlock className="h-5 w-5 text-purple-400" />
            ) : (
              <Lock className="h-5 w-5 text-purple-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{pool.name}</p>
            <p className="text-xs text-gray-500">{pool.lockPeriod}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-emerald-400">{pool.apy}%</p>
          <p className="text-[10px] text-gray-500">APY</p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-white/[0.04] p-2 text-center">
          <p className="text-[10px] text-gray-500">TVL</p>
          <p className="text-sm font-medium text-white">{pool.tvl}</p>
        </div>
        <div className="rounded-lg bg-white/[0.04] p-2 text-center">
          <p className="text-[10px] text-gray-500">Min Stake</p>
          <p className="text-sm font-medium text-white">{pool.minStake}</p>
        </div>
      </div>

      {hasStake && (
        <div className="mb-4 rounded-lg bg-emerald-500/10 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400">Your Stake</span>
            <span className="text-sm font-bold text-emerald-400">{userStake} {pool.token}</span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onStake}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-purple-600 py-2 text-xs font-medium text-white transition hover:bg-purple-500"
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Stake
        </button>
        {hasStake && (
          <button
            onClick={onUnstake}
            className="flex items-center justify-center rounded-lg border border-white/[0.08] px-4 py-2 text-xs text-gray-400 transition hover:bg-white/[0.04]"
          >
            Unstake
          </button>
        )}
      </div>
    </div>
  );
}
