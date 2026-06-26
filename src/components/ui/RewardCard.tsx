"use client";

import { Trophy, Star, Clock } from "lucide-react";

interface RewardCardProps {
  title: string;
  amount: string;
  currency?: string;
  rank?: number;
  deadline?: string;
  status?: "pending" | "claimed" | "expired";
  className?: string;
}

const statusConfig = {
  pending: { color: "text-amber-400", bg: "bg-amber-500/10", label: "Pending" },
  claimed: { color: "text-emerald-400", bg: "bg-emerald-500/10", label: "Claimed" },
  expired: { color: "text-gray-400", bg: "bg-gray-500/10", label: "Expired" },
};

export function RewardCard({
  title,
  amount,
  currency = "USDC",
  rank,
  deadline,
  status = "pending",
  className = "",
}: RewardCardProps) {
  const config = statusConfig[status];

  return (
    <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15">
            <Trophy className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{title}</p>
            {rank && (
              <div className="mt-0.5 flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-400" />
                <span className="text-xs text-amber-400">#{rank}</span>
              </div>
            )}
          </div>
        </div>
        <div className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${config.bg} ${config.color}`}>
          {config.label}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-white">{amount}</p>
          <p className="text-xs text-gray-500">{currency}</p>
        </div>
        {deadline && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>{deadline}</span>
          </div>
        )}
      </div>
    </div>
  );
}
