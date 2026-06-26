"use client";

import { useState } from "react";
import {
  Clock,
  TrendingUp,
  Vote,
  FileText,
  Search,
  X,
  Crown,
  CalendarDays,
} from "lucide-react";
import type { LeaderboardSortBy } from "@/types/creator-settlement";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TimeRange = "today" | "week" | "month" | "all";

interface LeaderboardFiltersProps {
  onTimeRangeChange?: (range: TimeRange) => void;
  onSortChange?: (sort: LeaderboardSortBy) => void;
  onSearchChange?: (query: string) => void;
  activeTimeRange?: TimeRange;
  activeSort?: LeaderboardSortBy;
}

// ---------------------------------------------------------------------------
// Filter configs
// ---------------------------------------------------------------------------

const TIME_RANGES: { key: TimeRange; label: string; icon: typeof Clock }[] = [
  { key: "today", label: "Today", icon: Clock },
  { key: "week", label: "This Week", icon: CalendarDays },
  { key: "month", label: "This Month", icon: CalendarDays },
  { key: "all", label: "All Time", icon: Crown },
];

const SORT_OPTIONS: {
  key: LeaderboardSortBy;
  label: string;
  icon: typeof TrendingUp;
}[] = [
  { key: "earnings", label: "Earnings", icon: TrendingUp },
  { key: "votes", label: "Votes", icon: Vote },
  { key: "submissions", label: "Works", icon: FileText },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LeaderboardFilters({
  onTimeRangeChange,
  onSortChange,
  onSearchChange,
  activeTimeRange: controlledTimeRange,
  activeSort: controlledSort,
}: LeaderboardFiltersProps) {
  const [internalTimeRange, setInternalTimeRange] =
    useState<TimeRange>("all");
  const [internalSort, setInternalSort] =
    useState<LeaderboardSortBy>("earnings");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const timeRange = controlledTimeRange ?? internalTimeRange;
  const sort = controlledSort ?? internalSort;

  const handleTimeRangeChange = (range: TimeRange) => {
    setInternalTimeRange(range);
    onTimeRangeChange?.(range);
  };

  const handleSortChange = (sortBy: LeaderboardSortBy) => {
    setInternalSort(sortBy);
    onSortChange?.(sortBy);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearchChange?.("");
  };

  return (
    <div className="space-y-4 rounded-xl border border-white/[0.06] bg-[#1a1a1a] p-4">
      {/* Search bar */}
      <div
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${
          searchFocused
            ? "border-cyan-500/40 bg-white/[0.04]"
            : "border-white/[0.06] bg-white/[0.02]"
        }`}
      >
        <Search className="h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search creators by address..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="rounded p-0.5 text-gray-500 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Filter row: Time range + Sort type */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Time range */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-gray-500">
            Period
          </span>
          <div className="flex gap-1">
            {TIME_RANGES.map(({ key, label, icon: Icon }) => {
              const isActive = key === timeRange;
              return (
                <button
                  key={key}
                  onClick={() => handleTimeRangeChange(key)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                      : "bg-white/[0.03] text-gray-400 border border-transparent hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden h-6 w-px bg-white/[0.08] sm:block" />

        {/* Sort by */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-gray-500">
            Rank by
          </span>
          <div className="flex gap-1">
            {SORT_OPTIONS.map(({ key, label, icon: Icon }) => {
              const isActive = key === sort;
              return (
                <button
                  key={key}
                  onClick={() => handleSortChange(key)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                      : "bg-white/[0.03] text-gray-400 border border-transparent hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active filter summary */}
      {(timeRange !== "all" || searchQuery) && (
        <div className="flex items-center gap-2 border-t border-white/[0.04] pt-3">
          <span className="text-[10px] text-gray-500">Active filters:</span>
          {timeRange !== "all" && (
            <span className="flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-400">
              {TIME_RANGES.find((t) => t.key === timeRange)?.label}
              <button
                onClick={() => handleTimeRangeChange("all")}
                className="ml-0.5"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400">
              &quot;{searchQuery}&quot;
              <button onClick={clearSearch} className="ml-0.5">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
