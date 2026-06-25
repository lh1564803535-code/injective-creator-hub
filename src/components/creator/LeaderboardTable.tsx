"use client";

import { Trophy, TrendingUp, FileText, Award, Crown, Medal } from "lucide-react";
import { formatUSDC, shortenAddress } from "@/lib/injective";
import type { Creator, LeaderboardSortBy } from "@/types/creator-settlement";

interface LeaderboardTableProps {
  creators: Creator[];
  sortBy: LeaderboardSortBy;
  onSortChange?: (sortBy: LeaderboardSortBy) => void;
}

export function LeaderboardTable({
  creators,
  sortBy,
  onSortChange,
}: LeaderboardTableProps) {
  const sortOptions: { key: LeaderboardSortBy; label: string; icon: typeof Trophy }[] = [
    { key: "earnings", label: "Earnings", icon: Award },
    { key: "votes", label: "Votes", icon: TrendingUp },
    { key: "submissions", label: "Works", icon: FileText },
  ];

  const getRankVisual = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          bg: "bg-gradient-to-br from-amber-400 to-yellow-600",
          glow: "shadow-amber-500/40 shadow-lg",
          icon: <Crown className="h-4 w-4 text-white" />,
          ring: "ring-2 ring-amber-400/30",
        };
      case 2:
        return {
          bg: "bg-gradient-to-br from-gray-300 to-gray-500",
          glow: "shadow-gray-400/30 shadow-md",
          icon: <Medal className="h-4 w-4 text-white" />,
          ring: "ring-2 ring-gray-400/20",
        };
      case 3:
        return {
          bg: "bg-gradient-to-br from-orange-400 to-orange-600",
          glow: "shadow-orange-500/30 shadow-md",
          icon: <Medal className="h-4 w-4 text-white" />,
          ring: "ring-2 ring-orange-400/20",
        };
      default:
        return {
          bg: "bg-white/[0.06]",
          glow: "",
          icon: null,
          ring: "",
        };
    }
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Creator Leaderboard</h3>
          <p className="text-sm text-gray-500">Top creators by performance</p>
        </div>
        {onSortChange && (
          <div className="flex gap-1.5 rounded-xl bg-white/[0.04] p-1">
            {sortOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => onSortChange(option.key)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  sortBy === option.key
                    ? "bg-cyan-500/15 text-cyan-300 shadow-sm"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <option.icon className="h-3 w-3" />
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* List */}
      <div className="divide-y divide-white/[0.04]">
        {creators.length === 0 ? (
          <div className="p-12 text-center">
            <Trophy className="mx-auto mb-3 h-10 w-10 text-gray-600" />
            <p className="text-gray-400">No creators yet</p>
            <p className="mt-1 text-sm text-gray-600">
              Be the first to submit content
            </p>
          </div>
        ) : (
          creators.map((creator) => {
            const rankVis = getRankVisual(creator.rank);
            const isTop3 = creator.rank <= 3;

            return (
              <div
                key={creator.address}
                className={`group flex items-center gap-4 p-4 transition-all ${
                  isTop3 ? "bg-white/[0.01]" : ""
                } hover:bg-white/[0.03]`}
              >
                {/* Rank */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${rankVis.bg} ${rankVis.glow} ${rankVis.ring}`}
                >
                  {rankVis.icon || (
                    <span className="text-gray-400">{creator.rank}</span>
                  )}
                </div>

                {/* Avatar with glow for top 3 */}
                <div className="relative shrink-0">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white ${
                      isTop3
                        ? "bg-gradient-to-br from-cyan-400 to-blue-600 ring-2 ring-cyan-400/20"
                        : "bg-gradient-to-br from-gray-600 to-gray-700"
                    }`}
                  >
                    {creator.address.slice(2, 4).toUpperCase()}
                  </div>
                  {isTop3 && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#08080f] bg-emerald-400" />
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`font-mono text-sm ${
                      isTop3 ? "font-semibold text-white" : "text-gray-300"
                    }`}
                  >
                    {shortenAddress(creator.address)}
                  </p>
                  <p className="text-xs text-gray-600">
                    {creator.totalSubmissions} works · {creator.totalVotes} votes
                  </p>
                </div>

                {/* Earnings */}
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      creator.rank === 1
                        ? "text-amber-400"
                        : creator.rank === 2
                          ? "text-gray-300"
                          : creator.rank === 3
                            ? "text-orange-400"
                            : "text-gray-400"
                    }`}
                  >
                    {formatUSDC(creator.totalEarnings)}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-gray-600">
                    USDC
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
