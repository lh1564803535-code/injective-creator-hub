"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

export function FilterBar({
  options,
  selected,
  onChange,
  className = "",
}: FilterBarProps) {
  const toggleFilter = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <Filter className="h-4 w-4 text-gray-500" />

      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => toggleFilter(option.value)}
          className={`rounded-full px-3 py-1 text-xs transition ${
            selected.includes(option.value)
              ? "bg-cyan-500 text-white"
              : "bg-white/[0.04] text-gray-400 hover:bg-white/[0.08]"
          }`}
        >
          {option.label}
        </button>
      ))}

      {selected.length > 0 && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 rounded-full bg-white/[0.04] px-2 py-1 text-xs text-gray-500 hover:text-white"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      )}
    </div>
  );
}
