"use client";

import { useState } from "react";
import { PieChart, TrendingUp, ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";

interface RewardSource {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

const MOCK_SOURCES: RewardSource[] = [
  { name: "Campaign Rewards", amount: 845.50, color: "bg-cyan-500", percentage: 68 },
  { name: "Voting Income", amount: 125.30, color: "bg-emerald-500", percentage: 10 },
  { name: "Streak Bonuses", amount: 89.20, color: "bg-amber-500", percentage: 7 },
  { name: "Referral Commissions", amount: 67.80, color: "bg-purple-500", percentage: 5 },
  { name: "Tips & Donations", amount: 45.00, color: "bg-pink-500", percentage: 4 },
];

function formatCompact(value: number): string {
  if (value >= 10000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value.toFixed(2)}`;
}

export function RewardsBreakdown() {
  const [expanded, setExpanded] = useState(false);
  const total = MOCK_SOURCES.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="rounded-xl border border-[#2B3139] bg-[#1a1a1a] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-[#EAECEF]">
          <PieChart className="h-5 w-5 text-[#00D4AA]" />
          Rewards Breakdown
        </h3>
        <span className="font-mono text-sm font-bold text-[#00D4AA]">
          {formatCompact(total)}
        </span>
      </div>

      {/* Visual bar */}
      <div className="mb-4 flex h-3 overflow-hidden rounded-full bg-[#2B3139]">
        {MOCK_SOURCES.map((source) => (
          <div
            key={source.name}
            className={`${source.color} transition-all`}
            style={{ width: `${source.percentage}%` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {MOCK_SOURCES.slice(0, expanded ? MOCK_SOURCES.length : 3).map((source) => (
          <div
            key={source.name}
            className="flex items-center justify-between rounded-lg bg-[#1E2329] px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${source.color}`} />
              <span className="text-sm text-[#EAECEF]">{source.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-medium text-[#EAECEF]">
                {formatCompact(source.amount)}
              </span>
              <span className="text-xs text-[#848E9C]">{source.percentage}%</span>
            </div>
          </div>
        ))}
      </div>

      {MOCK_SOURCES.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg bg-[#2B3139] py-2 text-xs text-[#848E9C] transition hover:bg-[#2B3139] hover:text-[#EAECEF]"
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              Show all sources <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>
      )}

      {/* Trend */}
      <div className="mt-3 flex items-center gap-1 rounded-lg bg-emerald-500/5 px-3 py-2">
        <TrendingUp className="h-3 w-3 text-[#00D4AA]" />
        <span className="text-[10px] text-[#00D4AA]">
          +23% from last month
        </span>
        <ArrowUpRight className="h-3 w-3 text-[#00D4AA]" />
      </div>
    </div>
  );
}
