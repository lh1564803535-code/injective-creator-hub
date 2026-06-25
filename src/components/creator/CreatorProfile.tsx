"use client";

import { Award, TrendingUp, FileText, ExternalLink } from "lucide-react";
import { formatUSDC, shortenAddress } from "@/lib/injective";
import Link from "next/link";

interface CreatorProfileProps {
  address: string;
  totalEarnings?: bigint;
  totalVotes?: number;
  totalSubmissions?: number;
  variant?: "compact" | "full";
}

export function CreatorProfile({
  address,
  totalEarnings = BigInt(0),
  totalVotes = 0,
  totalSubmissions = 0,
  variant = "compact",
}: CreatorProfileProps) {
  // Generate a deterministic gradient from the address
  const hue1 = parseInt(address.slice(2, 5), 16) % 360;
  const hue2 = (hue1 + 120) % 360;
  const gradientStyle = {
    background: `linear-gradient(135deg, hsl(${hue1}, 70%, 50%), hsl(${hue2}, 60%, 40%))`,
  };

  if (variant === "compact") {
    return (
      <div className="group flex items-center gap-3 rounded-xl p-2 transition-all hover:bg-white/[0.03]">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-white/[0.08] transition-all group-hover:ring-cyan-500/30"
          style={gradientStyle}
        >
          {address.slice(2, 4).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-sm text-white">
            {shortenAddress(address)}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{totalVotes} votes</span>
            <span className="text-gray-700">·</span>
            <span>{totalSubmissions} works</span>
          </div>
        </div>
        <Link
          href={`/leaderboard?search=${address}`}
          className="shrink-0 rounded-lg p-1.5 text-gray-600 transition hover:bg-white/[0.06] hover:text-cyan-400"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  // Full variant
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm transition-all hover:border-white/[0.12] hover:bg-white/[0.05]">
      <div className="mb-4 flex items-center gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ring-2 ring-white/[0.1]"
          style={gradientStyle}
        >
          {address.slice(2, 4).toUpperCase()}
        </div>
        <div>
          <p className="font-mono text-base font-semibold text-white">
            {shortenAddress(address)}
          </p>
          <Link
            href={`/leaderboard?search=${address}`}
            className="text-xs text-cyan-400 hover:text-cyan-300"
          >
            View full profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-white/[0.03] p-3 text-center">
          <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
            <Award className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <p className="text-sm font-semibold text-white">
            {formatUSDC(totalEarnings)}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-gray-600">
            Earned
          </p>
        </div>
        <div className="rounded-xl bg-white/[0.03] p-3 text-center">
          <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10">
            <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <p className="text-sm font-semibold text-white">{totalVotes}</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-600">
            Votes
          </p>
        </div>
        <div className="rounded-xl bg-white/[0.03] p-3 text-center">
          <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10">
            <FileText className="h-3.5 w-3.5 text-violet-400" />
          </div>
          <p className="text-sm font-semibold text-white">{totalSubmissions}</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-600">
            Works
          </p>
        </div>
      </div>
    </div>
  );
}
