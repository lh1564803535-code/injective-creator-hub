"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Trophy,
  DollarSign,
  FileText,
  ChevronRight,
  Users,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { formatUSDC } from "@/lib/injective";
import type { Creator } from "@/types/creator-settlement";

// ---------------------------------------------------------------------------
// Mock creator data
// ---------------------------------------------------------------------------

const MOCK_CREATORS: (Creator & { avatarUrl?: string })[] = [
  {
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e",
    totalSubmissions: 28,
    totalVotes: 1560,
    totalEarnings: BigInt(12500000000),
    rank: 1,
  },
  {
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    totalSubmissions: 21,
    totalVotes: 980,
    totalEarnings: BigInt(8400000000),
    rank: 2,
  },
  {
    address: "0x1234567890abcdef1234567890abcdef12345678",
    totalSubmissions: 17,
    totalVotes: 720,
    totalEarnings: BigInt(5600000000),
    rank: 3,
  },
  {
    address: "0x9876543210fedcba9876543210fedcba98765432",
    totalSubmissions: 14,
    totalVotes: 510,
    totalEarnings: BigInt(3200000000),
    rank: 4,
  },
  {
    address: "0xabcdef1234567890abcdef1234567890abcdef12",
    totalSubmissions: 11,
    totalVotes: 340,
    totalEarnings: BigInt(2100000000),
    rank: 5,
  },
  {
    address: "0xdddd4444eeee5555ffff6666aaaa7777bbbb8888",
    totalSubmissions: 9,
    totalVotes: 280,
    totalEarnings: BigInt(1500000000),
    rank: 6,
  },
  {
    address: "0xeeee5555ffff6666aaaa7777bbbb8888cccc9999",
    totalSubmissions: 7,
    totalVotes: 190,
    totalEarnings: BigInt(900000000),
    rank: 7,
  },
  {
    address: "0xaaaa1111bbbb2222cccc3333dddd4444eeee5555",
    totalSubmissions: 5,
    totalVotes: 120,
    totalEarnings: BigInt(450000000),
    rank: 8,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function getAvatarGradient(address: string): string {
  const hash = address.slice(2, 10);
  const hue1 = parseInt(hash.slice(0, 3), 16) % 360;
  const hue2 = parseInt(hash.slice(3, 6), 16) % 360;
  return `linear-gradient(135deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 70%, 50%))`;
}

// ---------------------------------------------------------------------------
// Creator result card
// ---------------------------------------------------------------------------

function CreatorResultCard({
  creator,
  index,
}: {
  creator: Creator & { avatarUrl?: string };
  index: number;
}) {
  const rankBadgeColor =
    creator.rank === 1
      ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
      : creator.rank === 2
        ? "bg-gray-400/20 text-gray-300 border-gray-400/30"
        : creator.rank === 3
          ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
          : "bg-white/[0.04] text-gray-500 border-white/[0.08]";

  return (
    <Link
      href={`/creator/${creator.address}`}
      className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-cyan-500/20 hover:bg-white/[0.04]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Avatar */}
      <div
        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg"
        style={{ background: getAvatarGradient(creator.address) }}
      >
        {creator.address.slice(2, 4).toUpperCase()}
        {creator.rank <= 3 && (
          <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900">
            <Trophy
              className={`h-2.5 w-2.5 ${
                creator.rank === 1
                  ? "text-amber-400"
                  : creator.rank === 2
                    ? "text-gray-300"
                    : "text-orange-400"
              }`}
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">
            {shortenAddress(creator.address)}
          </p>
          <span
            className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${rankBadgeColor}`}
          >
            <Trophy className="h-2.5 w-2.5" />
            #{creator.rank}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            {formatUSDC(creator.totalEarnings)} USDC
          </span>
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {creator.totalSubmissions} submissions
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {creator.totalVotes} votes
          </span>
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="h-4 w-4 shrink-0 text-gray-600 transition group-hover:text-cyan-400" />
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function CreatorSearch() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Simulate search delay
  useEffect(() => {
    if (!query.trim()) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => setIsSearching(false), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_CREATORS;

    return MOCK_CREATORS.filter(
      (c) =>
        c.address.toLowerCase().includes(q) ||
        formatUSDC(c.totalEarnings).includes(q) ||
        String(c.rank).includes(q),
    );
  }, [query]);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
          <Search className="h-4 w-4 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Search Creators</h2>
          <p className="text-xs text-gray-500">
            Find creators by address, earnings, or rank
          </p>
        </div>
      </div>

      {/* Search input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by address, earnings..."
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-10 text-sm text-white placeholder-gray-600 outline-none transition focus:border-cyan-500/30 focus:bg-white/[0.06]"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-cyan-400" />
        )}
      </div>

      {/* Results count */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {results.length} creator{results.length !== 1 ? "s" : ""} found
        </p>
        {query.trim() && (
          <button
            onClick={() => setQuery("")}
            className="text-xs text-cyan-400 transition hover:text-cyan-300"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Results list */}
      <div className="space-y-2">
        {results.length > 0 ? (
          results.map((creator, index) => (
            <CreatorResultCard
              key={creator.address}
              creator={creator}
              index={index}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] py-12">
            <Search className="mb-3 h-8 w-8 text-gray-600" />
            <p className="text-sm text-gray-400">No creators found</p>
            <p className="mt-1 text-xs text-gray-600">
              Try a different search term
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
