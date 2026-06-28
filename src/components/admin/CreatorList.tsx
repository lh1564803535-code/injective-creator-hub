"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Download,
  Trophy,
  TrendingUp,
  FileText,
  Award,
  Crown,
  Medal,
  ExternalLink,
  Filter,
  ChevronDown,
} from "lucide-react";
import { formatUSDC, shortenAddress } from "@/lib/injective";
import type { Creator, LeaderboardSortBy } from "@/types/creator-settlement";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_CREATORS: (Creator & { twitter?: string; joinedAt: string })[] = [
  {
    address: "0xAbC1234567890aBcDeF1234567890aBcDeF1234",
    submissions: 45,
    earnings: 12500,
    rank: 1,
    twitter: "@creator_alpha",
    joinedAt: "2026-01-15",
  },
  {
    address: "0xDeF4567890123dEfAbC4567890123dEfAbC4567",
    submissions: 38,
    earnings: 8700,
    rank: 2,
    twitter: "@creator_beta",
    joinedAt: "2026-02-03",
  },
  {
    address: "0x789aBcDeF0123456789aBcDeF0123456789aBcDe",
    submissions: 29,
    earnings: 5400,
    rank: 3,
    twitter: "@creator_gamma",
    joinedAt: "2026-02-20",
  },
  {
    address: "0x012AbCdEf3456789012AbCdEf3456789012AbCdE",
    submissions: 21,
    earnings: 3200,
    rank: 4,
    twitter: undefined,
    joinedAt: "2026-03-10",
  },
  {
    address: "0xFfFfFfFfFfFfFfFfFfFfFfFfFfFfFfFfFfFfFfFf",
    submissions: 15,
    earnings: 1800,
    rank: 5,
    twitter: "@creator_delta",
    joinedAt: "2026-04-01",
  },
  {
    address: "0x1234567890aBcDeF1234567890aBcDeF12345678",
    submissions: 12,
    earnings: 1200,
    rank: 6,
    twitter: undefined,
    joinedAt: "2026-04-15",
  },
  {
    address: "0xAbCdEfAbCdEfAbCdEfAbCdEfAbCdEfAbCdEfAb",
    submissions: 9,
    earnings: 900,
    rank: 7,
    twitter: "@creator_epsilon",
    joinedAt: "2026-05-02",
  },
  {
    address: "0x9876543210FeDcBa9876543210FeDcBa98765432",
    submissions: 6,
    earnings: 500,
    rank: 8,
    twitter: "@creator_zeta",
    joinedAt: "2026-05-18",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CreatorList() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<LeaderboardSortBy>("earnings");
  const [showTwitterOnly, setShowTwitterOnly] = useState(false);

  // Filter + sort
  const creators = useMemo(() => {
    let result = [...MOCK_CREATORS];

    // Twitter filter
    if (showTwitterOnly) {
      result = result.filter((c) => c.twitter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.address.toLowerCase().includes(q) ||
          (c.twitter && c.twitter.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "earnings":
          return b.earnings - a.earnings;
        case "submissions":
          return b.submissions - a.submissions;
        default:
          return 0;
      }
    });

    // Re-rank
    result.forEach((c, i) => (c.rank = i + 1));
    return result;
  }, [search, sortBy, showTwitterOnly]);

  // Export CSV
  const handleExportCSV = () => {
    const header = "Rank,Address,Twitter,Votes,Submissions,Earnings (USDC),Joined\n";
    const rows = creators
      .map(
        (c) =>
          `${c.rank},${c.address},${c.twitter ?? ""},${c.submissions},${c.earnings},${c.joinedAt}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `creators-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Rank visual
  const getRankVisual = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          bg: "bg-gradient-to-br from-amber-400 to-yellow-600",
          glow: "shadow-amber-500/40 shadow-lg",
          icon: <Crown className="h-3.5 w-3.5 text-white" />,
        };
      case 2:
        return {
          bg: "bg-gradient-to-br from-gray-300 to-gray-500",
          glow: "shadow-gray-400/30 shadow-md",
          icon: <Medal className="h-3.5 w-3.5 text-white" />,
        };
      case 3:
        return {
          bg: "bg-gradient-to-br from-orange-400 to-orange-600",
          glow: "shadow-orange-500/30 shadow-md",
          icon: <Medal className="h-3.5 w-3.5 text-white" />,
        };
      default:
        return {
          bg: "bg-white/[0.06]",
          glow: "",
          icon: null as React.ReactNode,
        };
    }
  };

  const sortOptions: { key: LeaderboardSortBy; label: string; icon: typeof Trophy }[] = [
    { key: "earnings", label: "Earnings", icon: Award },
    { key: "votes", label: "Votes", icon: TrendingUp },
    { key: "submissions", label: "Submissions", icon: FileText },
  ];

  // ---- Render ----

  return (
    <div className="space-y-4">
      {/* Header + controls */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Creator Directory</h3>
            <p className="text-sm text-gray-400">
              {creators.length} creators · {creators.filter((c) => c.twitter).length} with Twitter
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search address or Twitter..."
                className="w-56 rounded-lg border border-white/[0.08] bg-white/[0.03] py-2 pl-9 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-cyan-500/40"
              />
            </div>

            {/* Twitter only toggle */}
            <button
              onClick={() => setShowTwitterOnly(!showTwitterOnly)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                showTwitterOnly
                  ? "border-[#1DA1F2]/30 bg-[#1DA1F2]/10 text-[#1DA1F2]"
                  : "border-white/[0.08] bg-white/[0.03] text-gray-400 hover:text-gray-300"
              }`}
            >
              <Filter className="h-3 w-3" />
              Twitter Only
            </button>

            {/* Export */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-medium text-gray-400 transition-colors hover:bg-white/[0.06] hover:text-gray-300"
            >
              <Download className="h-3 w-3" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Sort tabs */}
        <div className="mt-4 flex gap-1.5 rounded-xl bg-white/[0.03] p-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                sortBy === opt.key
                  ? "bg-cyan-500/15 text-cyan-300 shadow-sm"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <opt.icon className="h-3 w-3" />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1a1a1a]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs text-gray-500">
                <th className="w-16 px-5 py-3 font-medium">Rank</th>
                <th className="px-5 py-3 font-medium">Creator</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">Twitter</th>
                <th className="px-5 py-3 font-medium">Votes</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">Submissions</th>
                <th className="px-5 py-3 font-medium">Earnings</th>
                <th className="hidden px-5 py-3 font-medium lg:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {creators.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                    No creators found
                  </td>
                </tr>
              ) : (
                creators.map((creator) => {
                  const rv = getRankVisual(creator.rank);
                  return (
                    <tr
                      key={creator.address}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      {/* Rank */}
                      <td className="px-5 py-4">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${rv.bg} ${rv.glow}`}
                        >
                          {rv.icon || <span className="text-gray-400">{creator.rank}</span>}
                        </div>
                      </td>

                      {/* Creator address */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                              creator.rank <= 3
                                ? "bg-gradient-to-br from-cyan-400 to-blue-600"
                                : "bg-gradient-to-br from-gray-600 to-gray-700"
                            }`}
                          >
                            {creator.address.slice(2, 4).toUpperCase()}
                          </div>
                          <span className="font-mono text-sm text-gray-300">
                            {shortenAddress(creator.address)}
                          </span>
                        </div>
                      </td>

                      {/* Twitter */}
                      <td className="hidden px-5 py-4 sm:table-cell">
                        {creator.twitter ? (
                          <span className="text-sm text-[#1DA1F2]">{creator.twitter}</span>
                        ) : (
                          <span className="text-xs text-gray-600">-</span>
                        )}
                      </td>

                      {/* Submissions */}
                      <td className="hidden px-5 py-4 md:table-cell text-gray-300">
                        {creator.submissions}
                      </td>

                      {/* Earnings */}
                      <td className="px-5 py-4">
                        <span className="font-medium text-emerald-400">
                          ${creator.earnings.toLocaleString()}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="hidden px-5 py-4 lg:table-cell text-gray-500">
                        {creator.joinedAt}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
