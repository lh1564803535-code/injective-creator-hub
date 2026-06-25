"use client";

import { Clock, Users, Award, TrendingUp, CheckCircle } from "lucide-react";
import { formatUSDC } from "@/lib/injective";

interface CampaignStatsProps {
  totalReward: bigint;
  submissionCount: number;
  totalVotes: number;
  deadline: number;
  settled: boolean;
}

export function CampaignStats({
  totalReward,
  submissionCount,
  totalVotes,
  deadline,
  settled,
}: CampaignStatsProps) {
  const now = Math.floor(Date.now() / 1000);
  const totalDuration = deadline - now + 86400 * 7; // assume 7-day campaigns for progress
  const elapsed = totalDuration - (deadline - now);
  const progressPercent = settled
    ? 100
    : Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

  const remaining = deadline - now;
  const days = Math.floor(Math.max(0, remaining) / 86400);
  const hours = Math.floor((Math.max(0, remaining) % 86400) / 3600);
  const minutes = Math.floor((Math.max(0, remaining) % 3600) / 60);

  let timeDisplay: string;
  if (settled) {
    timeDisplay = "Completed";
  } else if (remaining <= 0) {
    timeDisplay = "Voting Open";
  } else if (days > 0) {
    timeDisplay = `${days}d ${hours}h remaining`;
  } else if (hours > 0) {
    timeDisplay = `${hours}h ${minutes}m remaining`;
  } else {
    timeDisplay = `${minutes}m remaining`;
  }

  const stats = [
    {
      icon: Award,
      label: "Total Reward",
      value: `${formatUSDC(totalReward)} USDC`,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      icon: Users,
      label: "Submissions",
      value: submissionCount.toString(),
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      icon: TrendingUp,
      label: "Total Votes",
      value: totalVotes.toString(),
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      icon: settled ? CheckCircle : Clock,
      label: "Status",
      value: timeDisplay,
      color: settled ? "text-emerald-400" : "text-gray-300",
      bg: settled ? "bg-emerald-500/10" : "bg-white/[0.04]",
    },
  ];

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm">
      {/* Stats grid */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-white/[0.02] p-3 text-center transition hover:bg-white/[0.04]"
          >
            <div
              className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${stat.bg}`}
            >
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <p className={`text-sm font-semibold ${stat.color}`}>{stat.value}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-gray-600">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Time progress bar */}
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-gray-500">Campaign Progress</span>
          <span className={settled ? "text-emerald-400" : "text-gray-400"}>
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              settled
                ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                : "bg-gradient-to-r from-cyan-500 to-blue-500"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
