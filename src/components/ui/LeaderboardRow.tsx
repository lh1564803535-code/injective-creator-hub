"use client";

import { Trophy, TrendingUp } from "lucide-react";

interface LeaderboardRowProps {
  rank: number;
  address: string;
  earnings: number;
  votes: number;
  submissions: number;
  highlight?: boolean;
  className?: string;
}

export function LeaderboardRow({
  rank,
  address,
  earnings,
  votes,
  submissions,
  highlight = false,
  className = "",
}: LeaderboardRowProps) {
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const rankColors = {
    1: "text-amber-400 bg-amber-500/15",
    2: "text-gray-300 bg-gray-500/15",
    3: "text-orange-400 bg-orange-500/15",
  };

  const rankColor = rankColors[rank as keyof typeof rankColors] || "text-gray-500 bg-white/[0.04]";

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition ${
        highlight
          ? "border-amber-500/20 bg-amber-500/5"
          : "border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04]"
      } ${className}`}
    >
      {/* Rank */}
      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${rankColor}`}>
        {rank <= 3 ? <Trophy className="h-4 w-4" /> : rank}
      </div>

      {/* Address */}
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{shortAddress}</p>
        <p className="text-xs text-gray-500">{submissions} submissions</p>
      </div>

      {/* Stats */}
      <div className="text-right">
        <p className="text-sm font-bold text-emerald-400">${earnings.toFixed(2)}</p>
        <div className="flex items-center gap-1 justify-end">
          <TrendingUp className="h-3 w-3 text-gray-500" />
          <span className="text-xs text-gray-500">{votes} votes</span>
        </div>
      </div>
    </div>
  );
}
