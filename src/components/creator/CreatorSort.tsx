"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ArrowUpDown,
  TrendingUp,
  Vote,
  FileText,
  Trophy,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CreatorSortField =
  | "earnings"
  | "votes"
  | "works"
  | "rank";

export type CreatorSortDirection = "asc" | "desc";

export interface CreatorSortValue {
  field: CreatorSortField;
  direction: CreatorSortDirection;
}

interface CreatorSortProps {
  value?: CreatorSortValue;
  onChange: (value: CreatorSortValue) => void;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SORT_OPTIONS: {
  field: CreatorSortField;
  label: string;
  icon: typeof TrendingUp;
}[] = [
  { field: "earnings", label: "Earnings", icon: TrendingUp },
  { field: "votes", label: "Votes", icon: Vote },
  { field: "works", label: "Works", icon: FileText },
  { field: "rank", label: "Rank", icon: Trophy },
];

const DIRECTION_OPTIONS: {
  direction: CreatorSortDirection;
  label: string;
}[] = [
  { direction: "desc", label: "Descending" },
  { direction: "asc", label: "Ascending" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CreatorSort({ value, onChange }: CreatorSortProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = value ?? { field: "earnings", direction: "desc" };
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

  const handleFieldChange = (field: CreatorSortField) => {
    onChange({ ...current, field });
    setIsOpen(false);
  };

  const handleDirectionChange = (direction: CreatorSortDirection) => {
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
        <div className="absolute right-0 top-full z-50 mt-1 w-52 rounded-xl border border-white/[0.08] bg-[#1a1a1a] py-1 shadow-lg">
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
