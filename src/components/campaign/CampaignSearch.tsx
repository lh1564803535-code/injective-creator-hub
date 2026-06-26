"use client";

import { useRef, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

export type CampaignStatusFilter = "all" | "active" | "voting" | "settled";
export type CampaignSortBy = "reward" | "deadline" | "submissions" | "newest";

interface CampaignSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: CampaignStatusFilter;
  onStatusFilterChange: (value: CampaignStatusFilter) => void;
  sortBy: CampaignSortBy;
  onSortByChange: (value: CampaignSortBy) => void;
  campaignFilter: string;
  onCampaignFilterChange: (value: string) => void;
  campaignOptions: { id: number; title: string }[];
  showCampaignFilter?: boolean;
}

const statusOptions: { value: CampaignStatusFilter; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "voting", label: "Voting" },
  { value: "settled", label: "Settled" },
];

const sortOptions: { value: CampaignSortBy; label: string }[] = [
  { value: "reward", label: "Highest Reward" },
  { value: "deadline", label: "Ending Soon" },
  { value: "submissions", label: "Most Submissions" },
  { value: "newest", label: "Newest" },
];

export function CampaignSearch({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  campaignFilter,
  onCampaignFilterChange,
  campaignOptions,
  showCampaignFilter = false,
}: CampaignSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (
      e.key === "/" &&
      !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement)
    ) {
      e.preventDefault();
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title or address..."
          className="w-full rounded-xl border border-white/[0.06] bg-[#13131b] py-3 pl-12 pr-16 text-white placeholder-gray-500 transition focus:border-cyan-500/50 focus:outline-none"
        />
        {!search && (
          <kbd className="absolute right-4 top-1/2 -translate-y-1/2 rounded border border-white/[0.1] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
            /
          </kbd>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status filter */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-500" />
          <div className="flex gap-1.5">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onStatusFilterChange(opt.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  statusFilter === opt.value
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                    : "bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:bg-white/[0.06]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as CampaignSortBy)}
            className="rounded-lg border border-white/[0.06] bg-[#13131b] px-3 py-1.5 text-xs text-gray-300 focus:border-cyan-500/50 focus:outline-none"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Campaign filter (optional, for leaderboard) */}
        {showCampaignFilter && (
          <select
            value={campaignFilter}
            onChange={(e) => onCampaignFilterChange(e.target.value)}
            className="rounded-lg border border-white/[0.06] bg-[#13131b] px-3 py-1.5 text-xs text-gray-300 focus:border-cyan-500/50 focus:outline-none"
          >
            <option value="all">All Campaigns</option>
            {campaignOptions.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.title}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
