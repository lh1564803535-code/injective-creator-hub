"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  LayoutGrid,
  List,
  Clock,
  Users,
  Award,
  ArrowUpRight,
  ChevronDown,
  SlidersHorizontal,
  Flame,
  TrendingUp,
  Sparkles,
  X,
  ArrowLeft,
} from "lucide-react";
import {
  formatUSDC,
  getTimeRemaining,
  getCampaignStatus,
} from "@/lib/injective";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { Campaign } from "@/types/creator-settlement";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ViewMode = "grid" | "list";
type SortBy = "reward" | "deadline" | "submissions" | "trending";
type StatusFilter = "all" | "active" | "voting" | "ended";

interface CampaignCategory {
  id: string;
  label: string;
  icon: typeof Flame;
  color: string;
}

const CATEGORIES: CampaignCategory[] = [
  { id: "all", label: "All", icon: Sparkles, color: "cyan" },
  { id: "content", label: "Content", icon: Flame, color: "amber" },
  { id: "development", label: "Development", icon: TrendingUp, color: "emerald" },
  { id: "design", label: "Design", icon: Award, color: "purple" },
  { id: "community", label: "Community", icon: Users, color: "rose" },
];

// Mock campaign categories (in a real app, campaigns would have a category field)
const CAMPAIGN_CATEGORIES: Record<number, string> = {
  1: "content",
  2: "content",
  3: "community",
  4: "development",
  5: "design",
  6: "content",
  7: "community",
  8: "development",
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CampaignExplorerProps {
  campaigns: Campaign[];
  /** Optional: show back link to hub */
  showBackLink?: boolean;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CategoryChip({
  category,
  active,
  onClick,
  reducedMotion,
}: {
  category: CampaignCategory;
  active: boolean;
  onClick: () => void;
  reducedMotion: boolean;
}) {
  const Icon = category.icon;
  const colorMap: Record<string, { active: string; inactive: string }> = {
    cyan: {
      active: "border-cyan-500/40 bg-cyan-500/15 text-cyan-300",
      inactive: "border-white/[0.06] bg-white/[0.02] text-gray-400 hover:border-white/[0.12] hover:text-gray-300",
    },
    amber: {
      active: "border-amber-500/40 bg-amber-500/15 text-amber-300",
      inactive: "border-white/[0.06] bg-white/[0.02] text-gray-400 hover:border-white/[0.12] hover:text-gray-300",
    },
    emerald: {
      active: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
      inactive: "border-white/[0.06] bg-white/[0.02] text-gray-400 hover:border-white/[0.12] hover:text-gray-300",
    },
    purple: {
      active: "border-purple-500/40 bg-purple-500/15 text-purple-300",
      inactive: "border-white/[0.06] bg-white/[0.02] text-gray-400 hover:border-white/[0.12] hover:text-gray-300",
    },
    rose: {
      active: "border-rose-500/40 bg-rose-500/15 text-rose-300",
      inactive: "border-white/[0.06] bg-white/[0.02] text-gray-400 hover:border-white/[0.12] hover:text-gray-300",
    },
  };

  const colors = colorMap[category.color] || colorMap.cyan;

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
        active ? colors.active : colors.inactive
      } ${reducedMotion ? "" : "hover:scale-[1.03] active:scale-[0.97]"}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {category.label}
    </button>
  );
}

function CampaignExplorerCard({
  campaign,
  index,
  reducedMotion,
}: {
  campaign: Campaign;
  index: number;
  reducedMotion: boolean;
}) {
  const status = getCampaignStatus(campaign.deadline, campaign.settled);
  const timeRemaining = getTimeRemaining(campaign.deadline);

  const statusConfig = {
    active: {
      label: "Live",
      dot: "bg-emerald-400",
      className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    voting: {
      label: "Voting",
      dot: "bg-amber-400",
      className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    ended: {
      label: "Ended",
      dot: "bg-gray-500",
      className: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    },
  };

  const config = statusConfig[status];
  const reward = Number(formatUSDC(campaign.totalReward));
  const category = CAMPAIGN_CATEGORIES[campaign.id] || "content";
  const categoryObj = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];

  // Reward tier
  const tier =
    reward >= 5000
      ? { label: "Mega", color: "text-amber-300", bg: "bg-amber-500/10 border-amber-500/20" }
      : reward >= 2000
      ? { label: "Premium", color: "text-cyan-300", bg: "bg-cyan-500/10 border-cyan-500/20" }
      : reward >= 1000
      ? { label: "Standard", color: "text-emerald-300", bg: "bg-emerald-500/10 border-emerald-500/20" }
      : { label: "Starter", color: "text-gray-300", bg: "bg-gray-500/10 border-gray-500/20" };

  return (
    <Link
      href={`/campaign/${campaign.id}`}
      className={`group relative flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-white/[0.12] hover:bg-white/[0.04] ${
        reducedMotion ? "" : "hover:-translate-y-1"
      }`}
      style={reducedMotion ? {} : { animationDelay: `${index * 60}ms` }}
    >
      {/* Top row: status + tier */}
      <div className="mb-3 flex items-center justify-between">
        <div
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${config.className}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
          {config.label}
        </div>
        <div
          className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${tier.bg} ${tier.color}`}
        >
          {tier.label}
        </div>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-sm font-semibold text-white transition-colors group-hover:text-cyan-300">
        {campaign.title}
      </h3>

      {/* Description */}
      <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-gray-500">
        {campaign.description}
      </p>

      {/* Stats row */}
      <div className="mt-auto flex items-center gap-3 border-t border-white/[0.04] pt-3">
        <div className="flex items-center gap-1">
          <Award className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-xs font-medium text-amber-300">
            {formatUSDC(campaign.totalReward)} USDC
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5 text-gray-500" />
          <span className="text-xs text-gray-400">
            {campaign.submissionCount} subs
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-gray-500" />
          <span className="text-xs text-gray-400">{timeRemaining}</span>
        </div>
      </div>

      {/* Category tag */}
      <div className="mt-2 flex items-center gap-1">
        <categoryObj.icon className="h-3 w-3 text-gray-600" />
        <span className="text-[10px] text-gray-600">{categoryObj.label}</span>
      </div>

      {/* Hover arrow */}
      <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
        <ArrowUpRight className="h-4 w-4 text-cyan-400" />
      </div>
    </Link>
  );
}

function CampaignExplorerListRow({
  campaign,
  index,
}: {
  campaign: Campaign;
  index: number;
}) {
  const status = getCampaignStatus(campaign.deadline, campaign.settled);
  const timeRemaining = getTimeRemaining(campaign.deadline);

  const statusConfig = {
    active: { label: "Live", dot: "bg-emerald-400", text: "text-emerald-400" },
    voting: { label: "Voting", dot: "bg-amber-400", text: "text-amber-400" },
    ended: { label: "Ended", dot: "bg-gray-500", text: "text-gray-400" },
  };

  const config = statusConfig[status];

  return (
    <Link
      href={`/campaign/${campaign.id}`}
      className="group flex items-center gap-4 rounded-xl border border-white/[0.04] bg-white/[0.015] px-4 py-3 transition-all hover:border-white/[0.1] hover:bg-white/[0.03]"
    >
      {/* Index */}
      <span className="w-6 text-center text-xs font-medium text-gray-600">
        {index + 1}
      </span>

      {/* Status dot */}
      <span className={`h-2 w-2 rounded-full ${config.dot}`} />

      {/* Title + description */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-200 group-hover:text-cyan-300">
          {campaign.title}
        </p>
        <p className="truncate text-xs text-gray-500">{campaign.description}</p>
      </div>

      {/* Reward */}
      <div className="hidden w-28 text-right sm:block">
        <p className="text-sm font-medium text-amber-300">
          {formatUSDC(campaign.totalReward)} USDC
        </p>
      </div>

      {/* Submissions */}
      <div className="hidden w-20 text-right md:block">
        <p className="text-sm text-gray-400">{campaign.submissionCount}</p>
      </div>

      {/* Time */}
      <div className="w-20 text-right">
        <p className={`text-xs ${config.text}`}>{timeRemaining}</p>
      </div>

      {/* Arrow */}
      <ArrowUpRight className="h-4 w-4 shrink-0 text-gray-600 opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function CampaignExplorer({
  campaigns,
  showBackLink = false,
}: CampaignExplorerProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("trending");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const reducedMotion = useReducedMotion();
  const searchRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: / to focus search
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Filter + sort
  const filtered = useMemo(() => {
    let result = [...campaigns];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    // Category
    if (category !== "all") {
      result = result.filter(
        (c) => (CAMPAIGN_CATEGORIES[c.id] || "content") === category
      );
    }

    // Status
    if (statusFilter !== "all") {
      result = result.filter((c) => {
        const s = getCampaignStatus(c.deadline, c.settled);
        return s === statusFilter;
      });
    }

    // Sort
    switch (sortBy) {
      case "reward":
        result.sort((a, b) => Number(b.totalReward - a.totalReward));
        break;
      case "deadline":
        result.sort((a, b) => a.deadline - b.deadline);
        break;
      case "submissions":
        result.sort((a, b) => b.submissionCount - a.submissionCount);
        break;
      case "trending":
        // Trending = high reward + many submissions + active
        result.sort((a, b) => {
          const scoreA =
            Number(a.totalReward) / 1e6 +
            a.submissionCount * 50 +
            (getCampaignStatus(a.deadline, a.settled) === "active" ? 500 : 0);
          const scoreB =
            Number(b.totalReward) / 1e6 +
            b.submissionCount * 50 +
            (getCampaignStatus(b.deadline, b.settled) === "active" ? 500 : 0);
          return scoreB - scoreA;
        });
        break;
    }

    return result;
  }, [campaigns, search, category, statusFilter, sortBy]);

  const activeFilterCount =
    (category !== "all" ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0) +
    (sortBy !== "trending" ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      {showBackLink && (
        <Link
          href="/"
          className="mb-2 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Hub
        </Link>
      )}

      {/* Search bar + view toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 pl-10 pr-16 text-sm text-white placeholder-gray-500 transition-all focus:border-cyan-500/30 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
          />
          {search ? (
            <button
              onClick={() => setSearch("")}
              className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-white/[0.08] px-1.5 py-0.5 text-[10px] text-gray-600">
              /
            </span>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
            showFilters
              ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
              : "border-white/[0.06] bg-white/[0.03] text-gray-400 hover:text-white"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeFilterCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-bold text-black">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* View toggle */}
        <div className="flex overflow-hidden rounded-xl border border-white/[0.06]">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex h-10 w-10 items-center justify-center transition ${
              viewMode === "grid"
                ? "bg-white/[0.08] text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex h-10 w-10 items-center justify-center transition ${
              viewMode === "list"
                ? "bg-white/[0.08] text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat.id}
            category={cat}
            active={category === cat.id}
            onClick={() => setCategory(cat.id)}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          {/* Status filter */}
          <div>
            <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-gray-500">
              Status
            </label>
            <div className="flex gap-1">
              {(["all", "active", "voting", "ended"] as StatusFilter[]).map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition ${
                      statusFilter === s
                        ? "bg-cyan-500/15 text-cyan-300"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {s}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-gray-500">
              Sort By
            </label>
            <div className="flex gap-1">
              {(
                [
                  { id: "trending", label: "Trending" },
                  { id: "reward", label: "Reward" },
                  { id: "deadline", label: "Deadline" },
                  { id: "submissions", label: "Submissions" },
                ] as { id: SortBy; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    sortBy === opt.id
                      ? "bg-cyan-500/15 text-cyan-300"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setCategory("all");
                setStatusFilter("all");
                setSortBy("trending");
              }}
              className="ml-auto text-xs text-gray-500 transition hover:text-red-400"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {filtered.length} campaign{filtered.length !== 1 ? "s" : ""} found
          {search && (
            <span>
              {" "}
              for &ldquo;<span className="text-cyan-400">{search}</span>&rdquo;
            </span>
          )}
        </p>
        {(search || category !== "all" || statusFilter !== "all") && (
          <button
            onClick={() => {
              setSearch("");
              setCategory("all");
              setStatusFilter("all");
            }}
            className="text-xs text-gray-500 transition hover:text-cyan-400"
          >
            Reset all
          </button>
        )}
      </div>

      {/* Campaign grid/list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02] py-16">
          <Search className="mb-4 h-10 w-10 text-gray-600" />
          <p className="text-sm text-gray-400">No campaigns match your filters</p>
          <button
            onClick={() => {
              setSearch("");
              setCategory("all");
              setStatusFilter("all");
            }}
            className="mt-2 text-xs text-cyan-400 transition hover:text-cyan-300"
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div
          className={`grid gap-4 ${
            reducedMotion
              ? ""
              : "animate-fade-in-up"
          } sm:grid-cols-2 lg:grid-cols-3`}
        >
          {filtered.map((campaign, i) => (
            <CampaignExplorerCard
              key={campaign.id}
              campaign={campaign}
              index={i}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((campaign, i) => (
            <CampaignExplorerListRow
              key={campaign.id}
              campaign={campaign}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
