"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Crown,
  Medal,
  Award,
  TrendingUp,
  FileText,
  DollarSign,
} from "lucide-react";
import { Table, type TableColumn, type SortState } from "@/components/ui/Table";
import { formatUSDC, shortenAddress } from "@/lib/injective";
import type { Creator, LeaderboardSortBy } from "@/types/creator-settlement";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CreatorSortKey = "totalEarnings" | "totalVotes" | "totalSubmissions" | "rank";

interface CreatorTableProps {
  creators: Creator[];
  onRowClick?: (creator: Creator) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 shadow-lg shadow-amber-500/30">
        <Crown className="h-4 w-4 text-white" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-500 shadow-md shadow-gray-400/20">
        <Medal className="h-4 w-4 text-white" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-md shadow-orange-500/20">
        <Medal className="h-4 w-4 text-white" />
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-sm font-semibold text-gray-400">
      {rank}
    </div>
  );
}

function TierBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
        <Award className="h-2.5 w-2.5" />
        Top 3
      </span>
    );
  }
  if (rank <= 10) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
        Top 10
      </span>
    );
  }
  return null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CreatorTable({ creators, onRowClick }: CreatorTableProps) {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | "top3" | "top10">("all");
  const [sort, setSort] = useState<SortState>({
    key: "rank",
    direction: "asc",
  });

  // Filter
  const filtered = useMemo(() => {
    let result = creators;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) =>
        c.address.toLowerCase().includes(q)
      );
    }

    if (tierFilter === "top3") {
      result = result.filter((c) => c.rank <= 3);
    } else if (tierFilter === "top10") {
      result = result.filter((c) => c.rank <= 10);
    }

    return result;
  }, [creators, search, tierFilter]);

  // Tier counts
  const tierCounts = useMemo(() => ({
    all: creators.length,
    top3: creators.filter((c) => c.rank <= 3).length,
    top10: creators.filter((c) => c.rank <= 10).length,
  }), [creators]);

  // Quick sort presets
  const sortPresets: { key: LeaderboardSortBy; label: string; icon: typeof Award; sortKey: string }[] = [
    { key: "earnings", label: "Earnings", icon: DollarSign, sortKey: "totalEarnings" },
    { key: "votes", label: "Votes", icon: TrendingUp, sortKey: "totalVotes" },
    { key: "submissions", label: "Works", icon: FileText, sortKey: "totalSubmissions" },
  ];

  // Columns
  const columns: TableColumn<Creator>[] = [
    {
      key: "rank",
      header: "Rank",
      sortable: true,
      width: "8%",
      align: "center",
      render: (item) => <RankBadge rank={item.rank} />,
    },
    {
      key: "address",
      header: "Creator",
      sortable: true,
      width: "35%",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
              item.rank <= 3
                ? "bg-gradient-to-br from-cyan-400 to-blue-600 ring-1 ring-cyan-400/20"
                : "bg-gradient-to-br from-gray-600 to-gray-700"
            }`}
          >
            {item.address.slice(2, 4).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-mono text-sm font-medium text-white">
                {shortenAddress(item.address)}
              </p>
              <TierBadge rank={item.rank} />
            </div>
            <p className="text-xs text-gray-500">
              {item.totalSubmissions} works · {item.totalVotes} votes
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "totalEarnings",
      header: "Earnings",
      sortable: true,
      width: "18%",
      align: "right",
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
            <span className="text-[9px] font-bold text-emerald-400">$</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-400">
              {formatUSDC(item.totalEarnings)}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-gray-600">
              USDC
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "totalVotes",
      header: "Votes",
      sortable: true,
      width: "12%",
      align: "center",
      render: (item) => (
        <div className="flex items-center justify-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-gray-500" />
          <span className="text-sm text-gray-300">
            {item.totalVotes.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      key: "totalSubmissions",
      header: "Works",
      sortable: true,
      width: "12%",
      align: "center",
      render: (item) => (
        <div className="flex items-center justify-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-gray-500" />
          <span className="text-sm text-gray-300">{item.totalSubmissions}</span>
        </div>
      ),
    },
    {
      key: "performance",
      header: "Score",
      width: "12%",
      align: "center",
      render: (item) => {
        // Simple performance score: votes per submission
        const score =
          item.totalSubmissions > 0
            ? Math.round(item.totalVotes / item.totalSubmissions)
            : 0;
        const barWidth = Math.min(100, score * 2);
        return (
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-medium text-gray-300">{score}</span>
            <div className="h-1 w-12 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        );
      },
    },
  ];

  // Tier filter tabs
  const tierTabs: { key: "all" | "top3" | "top10"; label: string }[] = [
    { key: "all", label: "All" },
    { key: "top3", label: "Top 3" },
    { key: "top10", label: "Top 10" },
  ];

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Creator Leaderboard
          </h3>
          <p className="text-sm text-gray-500">
            {filtered.length} of {creators.length} creators
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick sort presets */}
          <div className="flex gap-1 rounded-lg bg-white/[0.04] p-0.5">
            {sortPresets.map((preset) => (
              <button
                key={preset.key}
                onClick={() =>
                  setSort({ key: preset.sortKey, direction: "desc" })
                }
                className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                  sort.key === preset.sortKey
                    ? "bg-cyan-500/15 text-cyan-300"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <preset.icon className="h-3 w-3" />
                {preset.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search address..."
              className="h-9 w-40 rounded-lg border border-white/[0.08] bg-white/[0.04] pl-9 pr-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-cyan-500/40 focus:bg-white/[0.06]"
            />
          </div>
        </div>
      </div>

      {/* Tier filter tabs */}
      <div className="flex items-center gap-1 border-b border-white/[0.06] px-5">
        <Filter className="mr-2 h-4 w-4 text-gray-500" />
        {tierTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setTierFilter(tab.key)}
            className={`border-b-2 px-3 py-2.5 text-xs font-medium transition ${
              tierFilter === tab.key
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-[10px] text-gray-600">
              {tierCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <Table<Creator>
        columns={columns}
        data={filtered}
        sort={sort}
        onSortChange={setSort}
        onRowClick={onRowClick}
        pageSize={15}
        zebra
        emptyMessage="No creators found"
        rowKey={(item) => item.address}
      />
    </div>
  );
}
