"use client";

import { useState } from "react";
import { DollarSign, TrendingUp, Trophy, ChevronDown, ChevronUp, BarChart3 } from "lucide-react";

interface CampaignEarning {
  campaignName: string;
  amount: number;
  votes: number;
  rank: number;
  color: string;
}

const MOCK_EARNINGS: CampaignEarning[] = [
  { campaignName: "Injective Summer Art Contest", amount: 320.0, votes: 142, rank: 1, color: "bg-cyan-500" },
  { campaignName: "DeFi Explainer Challenge", amount: 215.5, votes: 98, rank: 2, color: "bg-emerald-500" },
  { campaignName: "Community Meme Campaign", amount: 150.0, votes: 67, rank: 3, color: "bg-amber-500" },
  { campaignName: "Developer Tutorial Series", amount: 100.0, votes: 45, rank: 5, color: "bg-purple-500" },
  { campaignName: "NFT Showcase Week", amount: 60.0, votes: 23, rank: 4, color: "bg-pink-500" },
];

// Mock monthly trend data (last 6 months)
const TREND_DATA = [
  { month: "Jan", value: 120 },
  { month: "Feb", value: 180 },
  { month: "Mar", value: 95 },
  { month: "Apr", value: 260 },
  { month: "May", value: 310 },
  { month: "Jun", value: 845 },
];

function formatUSD(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function EarningsBreakdown() {
  const [expanded, setExpanded] = useState(false);
  const total = MOCK_EARNINGS.reduce((sum, e) => sum + e.amount, 0);
  const totalVotes = MOCK_EARNINGS.reduce((sum, e) => sum + e.votes, 0);
  const maxTrend = Math.max(...TREND_DATA.map((d) => d.value));

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
            <DollarSign className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Earnings Breakdown</h3>
            <p className="text-sm text-gray-500">Performance across campaigns</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-white/[0.03] p-3 text-center">
          <p className="text-xs text-gray-500">Total Earned</p>
          <p className="mt-1 font-mono text-lg font-bold text-emerald-400">{formatUSD(total)}</p>
        </div>
        <div className="rounded-xl bg-white/[0.03] p-3 text-center">
          <p className="text-xs text-gray-500">Total Votes</p>
          <p className="mt-1 font-mono text-lg font-bold text-white">{totalVotes}</p>
        </div>
        <div className="rounded-xl bg-white/[0.03] p-3 text-center">
          <p className="text-xs text-gray-500">Campaigns</p>
          <p className="mt-1 font-mono text-lg font-bold text-white">{MOCK_EARNINGS.length}</p>
        </div>
      </div>

      {/* Earnings Table */}
      <div className="mb-4 overflow-hidden rounded-xl border border-white/[0.06]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Campaign</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500">Earnings</th>
              <th className="hidden sm:table-cell px-4 py-2.5 text-right text-xs font-medium text-gray-500">Votes</th>
              <th className="hidden sm:table-cell px-4 py-2.5 text-right text-xs font-medium text-gray-500">Rank</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_EARNINGS.slice(0, expanded ? MOCK_EARNINGS.length : 3).map((earning) => (
              <tr
                key={earning.campaignName}
                className="border-b border-white/[0.03] last:border-0 transition hover:bg-white/[0.02]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${earning.color}`} />
                    <span className="text-sm text-gray-300 truncate max-w-[180px]">{earning.campaignName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-mono text-sm font-medium text-white">{formatUSD(earning.amount)}</span>
                </td>
                <td className="hidden sm:table-cell px-4 py-3 text-right">
                  <span className="text-sm text-gray-400">{earning.votes}</span>
                </td>
                <td className="hidden sm:table-cell px-4 py-3 text-right">
                  <span className={`inline-flex items-center gap-1 text-sm ${
                    earning.rank <= 3 ? "text-amber-400" : "text-gray-400"
                  }`}>
                    {earning.rank <= 3 && <Trophy className="h-3 w-3" />}
                    #{earning.rank}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show More */}
      {MOCK_EARNINGS.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mb-6 flex w-full items-center justify-center gap-1 rounded-lg bg-white/[0.04] py-2 text-xs text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
        >
          {expanded ? (
            <>Show less <ChevronUp className="h-3 w-3" /></>
          ) : (
            <>Show all campaigns <ChevronDown className="h-3 w-3" /></>
          )}
        </button>
      )}

      {/* CSS Bar Chart - Earnings Trend */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-cyan-400" />
          <h4 className="text-sm font-medium text-white">Monthly Trend</h4>
        </div>
        <div className="flex items-end justify-between gap-2" style={{ height: 120 }}>
          {TREND_DATA.map((d) => (
            <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
              <span className="font-mono text-[10px] text-gray-500">{formatUSD(d.value)}</span>
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-cyan-600 to-cyan-400 transition-all"
                style={{ height: `${(d.value / maxTrend) * 100}%`, minHeight: 4 }}
              />
              <span className="text-[10px] text-gray-500">{d.month}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-1 text-[10px] text-emerald-400">
          <TrendingUp className="h-3 w-3" />
          <span>+173% growth over the last 6 months</span>
        </div>
      </div>
    </div>
  );
}
