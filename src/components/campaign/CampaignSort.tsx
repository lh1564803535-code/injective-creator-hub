"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ArrowUpDown,
  Clock,
  DollarSign,
  Timer,
  Users,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CampaignSortField =
  | "newest"
  | "highestBonus"
  | "endingSoon"
  | "mostParticipants";

export type SortDirection = "asc" | "desc";

export interface CampaignSortValue {
  field: CampaignSortField;
  direction: SortDirection;
}

interface CampaignSortProps {
  value?: CampaignSortValue;
  onChange: (value: CampaignSortValue) => void;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SORT_OPTIONS: {
  field: CampaignSortField;
  label: string;
  icon: typeof Clock;
}[] = [
  { field: "newest", label: "Newest", icon: Clock },
  { field: "highestBonus", label: "Highest Bonus", icon: DollarSign },
  { field: "endingSoon", label: "Ending Soon", icon: Timer },
  { field: "mostParticipants", label: "Most Participants", icon: Users },
];

const DIRECTION_OPTIONS: { direction: SortDirection; label: string }[] = [
  { direction: "desc", label: "Descending" },
  { direction: "asc", label: "Ascending" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CampaignSort({ value, onChange }: CampaignSortProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = value ?? { field: "newest", direction: "desc" };
  const currentOption = SORT_OPTIONS.find((o) => o.field === current.field)!;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFieldChange = (field: CampaignSortField) => {
    onChange({ ...current, field });
    setIsOpen(false);
  };

  const handleDirectionChange = (direction: SortDirection) => {
    onChange({ ...current, direction });
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white transition hover:bg-white/[0.04]"
      >
        <ArrowUpDown className="h-4 w-4 text-gray-500" />
        <span>{currentOption.label}</span>
        <span className="text-[10px] text-gray-500">
          ({current.direction === "asc" ? "ASC" : "DESC"})
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-xl border border-white/[0.08] bg-[#1a1a1a] py-1 shadow-lg">
          {/* Sort field section */}
          <div className="px-3 py-1.5">
            <span className="text-[10px] uppercase tracking-wider text-gray-500">
              Sort by
            </span>
          </div>
          {SORT_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isActive = option.field === current.field;
            return (
              <button
                key={option.field}
                onClick={() => handleFieldChange(option.field)}
                className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm transition hover:bg-white/[0.04] ${
                  isActive ? "text-cyan-400" : "text-gray-300"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {option.label}
              </button>
            );
          })}

          {/* Divider */}
          <div className="mx-3 my-1 h-px bg-white/[0.06]" />

          {/* Direction section */}
          <div className="px-3 py-1.5">
            <span className="text-[10px] uppercase tracking-wider text-gray-500">
              Direction
            </span>
          </div>
          {DIRECTION_OPTIONS.map((option) => {
            const isActive = option.direction === current.direction;
            return (
              <button
                key={option.direction}
                onClick={() => handleDirectionChange(option.direction)}
                className={`flex w-full items-center px-4 py-2 text-left text-sm transition hover:bg-white/[0.04] ${
                  isActive ? "text-cyan-400" : "text-gray-300"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
