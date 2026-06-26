"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  ChevronDown,
  Check,
  Search,
  Megaphone,
  Gift,
  ArrowUpDown,
  X,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CampaignType =
  | "all"
  | "content"
  | "social"
  | "referral"
  | "ambassador"
  | "event";

export type RewardType =
  | "all"
  | "usdc"
  | "inj"
  | "nft"
  | "points";

export type CampaignSortBy =
  | "newest"
  | "endingSoon"
  | "highestReward"
  | "mostParticipants"
  | "trending";

interface CampaignSelectProps {
  /** Currently selected campaign type */
  campaignType?: CampaignType;
  /** Currently selected reward type */
  rewardType?: RewardType;
  /** Currently selected sort option */
  sortBy?: CampaignSortBy;
  /** Callback when campaign type changes */
  onCampaignTypeChange?: (value: CampaignType) => void;
  /** Callback when reward type changes */
  onRewardTypeChange?: (value: RewardType) => void;
  /** Callback when sort option changes */
  onSortByChange?: (value: CampaignSortBy) => void;
  /** Show campaign type selector */
  showCampaignType?: boolean;
  /** Show reward type selector */
  showRewardType?: boolean;
  /** Show sort selector */
  showSortBy?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

const CAMPAIGN_TYPE_OPTIONS: { value: CampaignType; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "All Types", icon: <Megaphone size={14} /> },
  { value: "content", label: "Content Creation", icon: <Megaphone size={14} /> },
  { value: "social", label: "Social Media", icon: <Megaphone size={14} /> },
  { value: "referral", label: "Referral", icon: <Megaphone size={14} /> },
  { value: "ambassador", label: "Ambassador", icon: <Megaphone size={14} /> },
  { value: "event", label: "Event", icon: <Megaphone size={14} /> },
];

const REWARD_TYPE_OPTIONS: { value: RewardType; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "All Rewards", icon: <Gift size={14} /> },
  { value: "usdc", label: "USDC", icon: <Gift size={14} /> },
  { value: "inj", label: "INJ Token", icon: <Gift size={14} /> },
  { value: "nft", label: "NFT", icon: <Gift size={14} /> },
  { value: "points", label: "Points", icon: <Gift size={14} /> },
];

const SORT_OPTIONS: { value: CampaignSortBy; label: string; icon: React.ReactNode }[] = [
  { value: "newest", label: "Newest", icon: <ArrowUpDown size={14} /> },
  { value: "endingSoon", label: "Ending Soon", icon: <ArrowUpDown size={14} /> },
  { value: "highestReward", label: "Highest Reward", icon: <ArrowUpDown size={14} /> },
  { value: "mostParticipants", label: "Most Participants", icon: <ArrowUpDown size={14} /> },
  { value: "trending", label: "Trending", icon: <ArrowUpDown size={14} /> },
];

// ---------------------------------------------------------------------------
// Inner Dropdown
// ---------------------------------------------------------------------------

interface DropdownSelectProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string; icon: React.ReactNode }[];
  onChange: (value: T) => void;
  searchable?: boolean;
}

function DropdownSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  searchable = false,
}: DropdownSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
        {label}
      </label>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) setSearch("");
        }}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-white/[0.02] px-4 py-2.5 text-sm outline-none transition ${
          isOpen
            ? "border-cyan-500/40"
            : "border-white/[0.06] hover:border-white/[0.12]"
        }`}
      >
        <span className="flex items-center gap-2 truncate text-white">
          {selected?.icon && (
            <span className="text-gray-400">{selected.icon}</span>
          )}
          {selected?.label ?? label}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1">
          <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d0f] shadow-xl shadow-black/40">
            {searchable && options.length > 5 && (
              <div className="border-b border-white/[0.06] p-2">
                <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-2">
                  <Search size={14} className="shrink-0 text-gray-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="text-gray-500 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}

            <ul className="max-h-60 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-center text-sm text-gray-500">
                  No options found
                </li>
              ) : (
                filtered.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                        setSearch("");
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition ${
                        opt.value === value
                          ? "bg-cyan-500/10 text-cyan-400"
                          : "text-gray-300 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <span className="shrink-0 text-gray-400">{opt.icon}</span>
                      <span className="flex-1 truncate">{opt.label}</span>
                      {opt.value === value && (
                        <Check size={14} className="shrink-0 text-cyan-400" />
                      )}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function CampaignSelect({
  campaignType = "all",
  rewardType = "all",
  sortBy = "newest",
  onCampaignTypeChange,
  onRewardTypeChange,
  onSortByChange,
  showCampaignType = true,
  showRewardType = true,
  showSortBy = true,
  className = "",
}: CampaignSelectProps) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.06] bg-white/[0.01] p-4 backdrop-blur-sm ${className}`}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {showCampaignType && (
          <DropdownSelect
            label="Campaign Type"
            value={campaignType}
            options={CAMPAIGN_TYPE_OPTIONS}
            onChange={(v) => onCampaignTypeChange?.(v as CampaignType)}
            searchable
          />
        )}
        {showRewardType && (
          <DropdownSelect
            label="Reward Type"
            value={rewardType}
            options={REWARD_TYPE_OPTIONS}
            onChange={(v) => onRewardTypeChange?.(v as RewardType)}
            searchable
          />
        )}
        {showSortBy && (
          <DropdownSelect
            label="Sort By"
            value={sortBy}
            options={SORT_OPTIONS}
            onChange={(v) => onSortByChange?.(v as CampaignSortBy)}
          />
        )}
      </div>
    </div>
  );
}
