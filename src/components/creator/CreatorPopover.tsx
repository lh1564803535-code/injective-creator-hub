"use client";

import {
  Trophy,
  DollarSign,
  ThumbsUp,
  FileText,
  TrendingUp,
  Crown,
  Medal,
} from "lucide-react";
import { formatUSDC, shortenAddress } from "@/lib/injective";
import { Popover } from "@/components/ui/Popover";
import type { Creator } from "@/types/creator-settlement";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CreatorPopoverProps {
  creator: Creator;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

// ---------------------------------------------------------------------------
// Rank badge helper
// ---------------------------------------------------------------------------

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="h-4 w-4 text-amber-400" />;
  if (rank === 2) return <Medal className="h-4 w-4 text-gray-300" />;
  if (rank === 3) return <Trophy className="h-4 w-4 text-orange-400" />;
  return <TrendingUp className="h-4 w-4 text-gray-500" />;
}

// ---------------------------------------------------------------------------
// CreatorPopover
// ---------------------------------------------------------------------------

export function CreatorPopover({
  creator,
  children,
  position = "bottom",
}: CreatorPopoverProps) {
  const rankLabel =
    creator.rank === 1
      ? "1st"
      : creator.rank === 2
        ? "2nd"
        : creator.rank === 3
          ? "3rd"
          : `${creator.rank}th`;

  return (
    <Popover trigger={children} position={position} className="w-64 p-4">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-500">
          <span className="text-xs font-bold text-white">
            {creator.address.slice(2, 4).toUpperCase()}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            {shortenAddress(creator.address)}
          </p>
          <p className="flex items-center gap-1 text-[10px] text-gray-400">
            <RankIcon rank={creator.rank} />
            <span>{rankLabel} Place</span>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-emerald-400" />
          <div>
            <p className="text-[10px] text-gray-500">Earnings</p>
            <p className="text-xs font-medium text-emerald-400">
              {formatUSDC(creator.totalEarnings)} USDC
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThumbsUp className="h-4 w-4 text-cyan-400" />
          <div>
            <p className="text-[10px] text-gray-500">Votes</p>
            <p className="text-xs font-medium text-cyan-400">
              {creator.totalVotes.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-purple-400" />
          <div>
            <p className="text-[10px] text-gray-500">Works</p>
            <p className="text-xs font-medium text-purple-400">
              {creator.totalSubmissions}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-400" />
          <div>
            <p className="text-[10px] text-gray-500">Rank</p>
            <p className="text-xs font-medium text-amber-400">
              #{creator.rank}
            </p>
          </div>
        </div>
      </div>

      {/* Performance bar */}
      <div className="mt-3 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-500">
            Avg Votes/Work
          </span>
          <span className="text-xs font-medium text-white">
            {creator.totalSubmissions > 0
              ? Math.round(creator.totalVotes / creator.totalSubmissions)
              : 0}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
            style={{
              width: `${Math.min(
                100,
                (creator.totalVotes / Math.max(1, creator.totalSubmissions)) * 2
              )}%`,
            }}
          />
        </div>
      </div>
    </Popover>
  );
}
