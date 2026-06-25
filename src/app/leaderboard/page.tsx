"use client";

import { useState } from "react";
import { Search, Trophy, TrendingUp, FileText } from "lucide-react";
import { LeaderboardTable } from "@/components/creator/LeaderboardTable";
import type { Creator, LeaderboardSortBy } from "@/types/creator-settlement";
import { MOCK_CREATORS } from "@/lib/mock-data";

export default function LeaderboardPage() {
  const [creators] = useState<Creator[]>(MOCK_CREATORS);
  const [sortBy, setSortBy] = useState<LeaderboardSortBy>("earnings");
  const [search, setSearch] = useState("");

  // Filter creators based on search
  const filteredCreators = creators.filter((creator) =>
    creator.address.toLowerCase().includes(search.toLowerCase())
  );

  // Sort creators
  const sortedCreators = [...filteredCreators].sort((a, b) => {
    switch (sortBy) {
      case "earnings":
        return Number(b.totalEarnings - a.totalEarnings);
      case "votes":
        return b.totalVotes - a.totalVotes;
      case "submissions":
        return b.totalSubmissions - a.totalSubmissions;
      default:
        return 0;
    }
  });

  // Calculate stats
  const totalEarnings = creators.reduce(
    (sum, c) => sum + c.totalEarnings,
    BigInt(0)
  );
  const totalVotes = creators.reduce((sum, c) => sum + c.totalVotes, 0);
  const totalSubmissions = creators.reduce(
    (sum, c) => sum + c.totalSubmissions,
    0
  );

  return (
    <div className="min-h-screen bg-[#0f0f14] p-6 pt-22 lg:p-8 lg:pt-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-white">Leaderboard</h1>
        <p className="text-gray-400">
          Top creators on Injective Creator Hub
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.06] bg-[#13131b] p-5">
          <div className="mb-2 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            <span className="text-sm text-gray-400">Total Earnings</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {(Number(totalEarnings) / 1e6).toLocaleString()} USDC
          </p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#13131b] p-5">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <span className="text-sm text-gray-400">Total Votes</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {totalVotes.toLocaleString()}
          </p>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#13131b] p-5">
          <div className="mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-400" />
            <span className="text-sm text-gray-400">Total Works</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalSubmissions}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by address..."
            className="w-full rounded-xl border border-white/[0.06] bg-[#13131b] py-3 pl-12 pr-4 text-white placeholder-gray-500 transition focus:border-cyan-500/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      <LeaderboardTable
        creators={sortedCreators}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
    </div>
  );
}
