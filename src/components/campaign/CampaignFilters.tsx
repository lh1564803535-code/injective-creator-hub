"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Palette,
  Music,
  Gamepad2,
  Smile,
  X,
} from "lucide-react";

type StatusFilter = "all" | "active" | "voting" | "ended";
type CategoryFilter = "all" | "illustration" | "music" | "gaming" | "meme";
type SortOption = "newest" | "highest_reward" | "ending_soon";

interface CampaignFiltersProps {
  onStatusChange?: (value: StatusFilter) => void;
  onCategoryChange?: (value: CategoryFilter) => void;
  onSortChange?: (value: SortOption) => void;
  onSearchChange?: (value: string) => void;
}

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "voting", label: "Voting" },
  { value: "ended", label: "Ended" },
];

const categoryOptions: {
  value: CategoryFilter;
  label: string;
  icon: typeof Palette;
}[] = [
  { value: "all", label: "All Types", icon: SlidersHorizontal },
  { value: "illustration", label: "Illustration", icon: Palette },
  { value: "music", label: "Music", icon: Music },
  { value: "gaming", label: "Gaming", icon: Gamepad2 },
  { value: "meme", label: "Meme", icon: Smile },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "highest_reward", label: "Highest Reward" },
  { value: "ending_soon", label: "Ending Soon" },
];

export function CampaignFilters({
  onStatusChange,
  onCategoryChange,
  onSortChange,
  onSearchChange,
}: CampaignFiltersProps) {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (
      e.key === "/" &&
      !(
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      )
    ) {
      e.preventDefault();
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleStatus = (value: StatusFilter) => {
    setStatus(value);
    onStatusChange?.(value);
  };

  const handleCategory = (value: CategoryFilter) => {
    setCategory(value);
    onCategoryChange?.(value);
  };

  const handleSort = (value: SortOption) => {
    setSort(value);
    onSortChange?.(value);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    onSearchChange?.(value);
  };

  const clearSearch = () => {
    setSearch("");
    onSearchChange?.("");
  };

  const activeFilterCount =
    (status !== "all" ? 1 : 0) +
    (category !== "all" ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4.5 w-4.5 text-gray-400" />
          <h3 className="text-sm font-semibold text-white">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/15 text-[10px] font-bold text-cyan-400">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={() => {
              handleStatus("all");
              handleCategory("all");
              handleSearch("");
            }}
            className="text-xs text-gray-500 transition hover:text-gray-300"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search campaigns..."
          className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pl-10 pr-10 text-sm text-white placeholder-gray-500 transition focus:border-cyan-500/50 focus:outline-none"
        />
        {search ? (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-white/[0.1] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
            /
          </kbd>
        )}
      </div>

      {/* Status filter */}
      <div className="mb-3">
        <p className="mb-2 text-xs text-gray-500">Status</p>
        <div className="flex flex-wrap gap-1.5">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleStatus(opt.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                status === opt.value
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                  : "bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:bg-white/[0.06]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="mb-3">
        <p className="mb-2 text-xs text-gray-500">Category</p>
        <div className="flex flex-wrap gap-1.5">
          {categoryOptions.map((opt) => {
            const CatIcon = opt.icon;
            return (
              <button
                key={opt.value}
                onClick={() => handleCategory(opt.value)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  category === opt.value
                    ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                    : "bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:bg-white/[0.06]"
                }`}
              >
                <CatIcon className="h-3.5 w-3.5" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs text-gray-500">
          <ArrowUpDown className="h-3 w-3" />
          Sort by
        </p>
        <div className="flex gap-1.5">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSort(opt.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                sort === opt.value
                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                  : "bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:bg-white/[0.06]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
