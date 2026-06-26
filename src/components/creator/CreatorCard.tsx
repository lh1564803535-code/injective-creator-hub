"use client";

import { Award, TrendingUp, FileText, Trophy, Medal, Crown } from "lucide-react";
import { formatUSDC, shortenAddress } from "@/lib/injective";
import type { Creator } from "@/types/creator-settlement";

// ---------------------------------------------------------------------------
// Rank badge
// ---------------------------------------------------------------------------

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 ring-2 ring-amber-400/30">
        <Crown className="h-4 w-4 text-amber-400" />
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400/20 ring-2 ring-gray-400/30">
        <Medal className="h-4 w-4 text-gray-300" />
      </div>
    );
  }

  if (rank === 3) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20 ring-2 ring-orange-400/30">
        <Trophy className="h-4 w-4 text-orange-400" />
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-xs font-bold text-gray-400">
      {rank}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Avatar from address
// ---------------------------------------------------------------------------

function CreatorAvatar({ address, size = "md" }: { address: string; size?: "sm" | "md" | "lg" }) {
  const hue1 = parseInt(address.slice(2, 5), 16) % 360;
  const hue2 = (hue1 + 120) % 360;
  const gradientStyle = {
    background: `linear-gradient(135deg, hsl(${hue1}, 70%, 50%), hsl(${hue2}, 60%, 40%))`,
  };

  const sizeClasses = {
    sm: "h-8 w-8 text-[10px]",
    md: "h-10 w-10 text-xs",
    lg: "h-12 w-12 text-sm",
  };

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ring-2 ring-white/[0.08] transition-all ${sizeClasses[size]}`}
      style={gradientStyle}
    >
      {address.slice(2, 4).toUpperCase()}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat item
// ---------------------------------------------------------------------------

interface StatItemProps {
  icon: React.ReactNode;
  iconBg: string;
  value: string | number;
  label: string;
}

function StatItem({ icon, iconBg, value, label }: StatItemProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{value}</p>
        <p className="text-[10px] uppercase tracking-wider text-gray-600">{label}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CreatorCard
// ---------------------------------------------------------------------------

interface CreatorCardProps {
  creator: Creator;
  className?: string;
}

export function CreatorCard({ creator, className = "" }: CreatorCardProps) {
  const { address, totalEarnings, totalVotes, totalSubmissions, rank } = creator;

  return (
    <div
      className={`group relative flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm transition-all hover:border-white/[0.12] hover:bg-white/[0.05] hover:shadow-xl ${className}`}
    >
      {/* Hover glow */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-500/0 blur-2xl transition-all group-hover:bg-cyan-500/10" />

      {/* Rank badge */}
      <RankBadge rank={rank} />

      {/* Avatar */}
      <CreatorAvatar address={address} />

      {/* Info */}
      <div className="relative min-w-0 flex-1">
        <p className="truncate font-mono text-sm font-semibold text-white transition-colors group-hover:text-cyan-300">
          {shortenAddress(address)}
        </p>
        <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {totalVotes}
          </span>
          <span className="text-gray-700">·</span>
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {totalSubmissions}
          </span>
        </div>
      </div>

      {/* Earnings */}
      <div className="relative shrink-0 text-right">
        <div className="flex items-center gap-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10">
            <Award className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <span className="text-sm font-semibold text-white">
            {formatUSDC(totalEarnings)}
          </span>
          <span className="text-xs text-gray-500">USDC</span>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/0 to-transparent transition-all group-hover:via-cyan-500/30" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// CreatorCardGrid — for displaying multiple creators
// ---------------------------------------------------------------------------

export function CreatorCardGrid({
  creators,
  className = "",
}: {
  creators: Creator[];
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {creators.map((creator) => (
        <CreatorCard key={creator.address} creator={creator} />
      ))}
    </div>
  );
}
