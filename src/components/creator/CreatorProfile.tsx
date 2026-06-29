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
  const hue1 = parseInt(address.slice(2, 5), 16) % 360;
  const hue2 = (hue1 + 120) % 360;
  const gradientStyle = {
    background: `linear-gradient(135deg, hsl(${hue1}, 70%, 50%), hsl(${hue2}, 60%, 40%))`,
  };

  if (variant === "compact") {
    return (
      <div className="group flex items-center gap-3 rounded-lg p-2 transition-all hover:bg-[#1E2329]">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ring-2 ring-[#2B3139] transition-all group-hover:ring-[#00D4AA]/30"
          style={gradientStyle}
        >
          {address.slice(2, 4).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-sm text-[#EAECEF]">
            {shortenAddress(address)}
          </p>
          <div className="flex items-center gap-2 text-xs text-[#848E9C]">
            <span>{totalVotes} votes</span>
            <span>·</span>
            <span>{totalSubmissions} works</span>
          </div>
        </div>
        <Link
          href={`/leaderboard?search=${address}`}
          className="shrink-0 rounded-lg p-1.5 text-[#848E9C] transition hover:bg-[#2B3139] hover:text-[#00D4AA]"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#2B3139] bg-[#1E2329] p-5 transition-all hover:border-[#00D4AA]/20">
      <div className="mb-4 flex items-center gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ring-2 ring-[#2B3139]"
          style={gradientStyle}
        >
          {address.slice(2, 4).toUpperCase()}
        </div>
        <div>
          <p className="font-mono text-base font-semibold text-[#EAECEF]">
            {shortenAddress(address)}
          </p>
          <Link
            href={`/leaderboard?search=${address}`}
            className="text-xs text-[#00D4AA] hover:text-[#00D4AA]/80"
          >
            View full profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-[#0B0E11] p-3 text-center">
          <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-lg bg-[#F0B90B]/10">
            <Award className="h-3.5 w-3.5 text-[#F0B90B]" />
          </div>
          <p className="font-mono text-sm font-semibold text-[#EAECEF]">
            {formatUSDC(totalEarnings)}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-[#848E9C]">Earned</p>
        </div>
        <div className="rounded-lg bg-[#0B0E11] p-3 text-center">
          <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-lg bg-[#00D4AA]/10">
            <TrendingUp className="h-3.5 w-3.5 text-[#00D4AA]" />
          </div>
          <p className="font-mono text-sm font-semibold text-[#EAECEF]">{totalVotes}</p>
          <p className="text-[10px] uppercase tracking-wider text-[#848E9C]">Votes</p>
        </div>
        <div className="rounded-lg bg-[#0B0E11] p-3 text-center">
          <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-lg bg-[#2B3139]">
            <FileText className="h-3.5 w-3.5 text-[#848E9C]" />
          </div>
          <p className="font-mono text-sm font-semibold text-[#EAECEF]">{totalSubmissions}</p>
          <p className="text-[10px] uppercase tracking-wider text-[#848E9C]">Works</p>
        </div>
      </div>
    </div>
  );
}
