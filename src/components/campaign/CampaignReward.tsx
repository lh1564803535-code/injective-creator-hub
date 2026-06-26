"use client";

import { useState, useEffect, useRef } from "react";
import { Trophy, Coins, Users, ChevronUp, TrendingUp, Sparkles } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type DistributionMode = "votes" | "ranking";

interface CampaignRewardProps {
  /** Total reward pool in USDC */
  totalPool: number;
  /** Reward token symbol */
  token?: string;
  /** Distribution mode */
  distributionMode?: DistributionMode;
  /** Number of winners */
  winnerCount?: number;
  /** Current user's reward (if any) */
  userReward?: number;
  /** Campaign title */
  campaignTitle?: string;
  /** Show detailed breakdown */
  showBreakdown?: boolean;
  /** Additional class names */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatUSDC(value: number): string {
  const parts = value.toFixed(2).split(".");
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${intPart}.${parts[1]}`;
}

/** Animate a number from 0 to target on mount */
function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function RewardBreakdownRow({
  rank,
  percentage,
  amount,
  rankColors,
}: {
  rank: number;
  percentage: number;
  amount: number;
  rankColors: string[];
}) {
  const medalEmoji = ["🥇", "🥈", "🥉"];
  const color = rank <= 3 ? rankColors[rank - 1] : "#9ca3af";

  return (
    <div className="flex items-center gap-3 rounded-lg bg-white/[0.02] border border-white/[0.04] px-3 py-2">
      <div
        className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold"
        style={{
          backgroundColor: `${color}20`,
          color,
        }}
      >
        {rank <= 3 ? medalEmoji[rank - 1] : `#${rank}`}
      </div>
      <div className="flex-1">
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(90deg, ${color}, ${color}80)`,
            }}
          />
        </div>
      </div>
      <span className="text-xs font-medium tabular-nums" style={{ color }}>
        ${formatUSDC(amount)}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CampaignReward({
  totalPool,
  token = "USDC",
  distributionMode = "votes",
  winnerCount = 5,
  userReward,
  campaignTitle,
  showBreakdown = true,
  className = "",
}: CampaignRewardProps) {
  const animatedPool = useCountUp(totalPool);
  const rankColors = ["#fbbf24", "#94a3b8", "#cd7f32"];

  // Mock breakdown percentages for display
  const breakdown = [
    { rank: 1, percentage: 35 },
    { rank: 2, percentage: 25 },
    { rank: 3, percentage: 18 },
    { rank: 4, percentage: 13 },
    { rank: 5, percentage: 9 },
  ].slice(0, winnerCount);

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-amber-500/20 bg-[#1a1a1a] ${className}`}>
      {/* Golden glow effect */}
      <div className="absolute -top-24 left-1/2 h-48 w-[120%] -translate-x-1/2 rounded-full bg-amber-500/8 blur-3xl" />

      <div className="relative p-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
              <Trophy className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Campaign Reward</h3>
              {campaignTitle && (
                <p className="text-xs text-gray-500">{campaignTitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span className="text-xs font-medium text-amber-400">
              {distributionMode === "votes" ? "By Votes" : "By Ranking"}
            </span>
          </div>
        </div>

        {/* Main reward amount */}
        <div className="mb-6 text-center">
          <p className="mb-1 text-xs text-gray-500">Total Reward Pool</p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="font-mono text-4xl font-bold tracking-tight bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
              ${formatUSDC(animatedPool)}
            </span>
            <span className="text-sm font-medium text-gray-400">{token}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
            <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10">
              <Users className="h-3 w-3 text-amber-400" />
            </div>
            <p className="text-lg font-bold text-white">{winnerCount}</p>
            <p className="text-[10px] text-gray-500">Winners</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
            <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10">
              <Coins className="h-3 w-3 text-amber-400" />
            </div>
            <p className="text-lg font-bold text-white">
              ${formatUSDC(totalPool / Math.max(winnerCount, 1))}
            </p>
            <p className="text-[10px] text-gray-500">Avg / Winner</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
            <div className="mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10">
              <TrendingUp className="h-3 w-3 text-amber-400" />
            </div>
            <p className="text-lg font-bold text-white">
              {distributionMode === "votes" ? "1:1" : "Tiered"}
            </p>
            <p className="text-[10px] text-gray-500">Distribution</p>
          </div>
        </div>

        {/* User reward highlight */}
        {userReward !== undefined && userReward > 0 && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-amber-500/20 bg-amber-500/[0.05] px-4 py-3">
            <div className="flex items-center gap-2">
              <ChevronUp className="h-4 w-4 text-amber-400" />
              <span className="text-sm text-gray-300">Your Reward</span>
            </div>
            <span className="text-lg font-bold text-amber-400">
              ${formatUSDC(userReward)}
            </span>
          </div>
        )}

        {/* Breakdown */}
        {showBreakdown && (
          <div>
            <p className="mb-2 text-xs font-medium text-gray-400">
              {distributionMode === "votes"
                ? "Proportional Breakdown"
                : "Ranking Breakdown"}
            </p>
            <div className="space-y-1.5">
              {breakdown.map((item) => (
                <RewardBreakdownRow
                  key={item.rank}
                  rank={item.rank}
                  percentage={item.percentage}
                  amount={(item.percentage / 100) * totalPool}
                  rankColors={rankColors}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
