"use client";

import { Scale } from "lucide-react";

interface VoteWeightProps {
  weight: number; // 1-5
  maxWeight?: number;
  onChange?: (weight: number) => void;
  readonly?: boolean;
  className?: string;
}

export function VoteWeight({
  weight,
  maxWeight = 5,
  onChange,
  readonly = false,
  className = "",
}: VoteWeightProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Scale className="h-4 w-4 text-gray-500" />
      <div className="flex gap-1">
        {Array.from({ length: maxWeight }, (_, i) => i + 1).map((w) => (
          <button
            key={w}
            onClick={() => !readonly && onChange?.(w)}
            disabled={readonly}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition ${
              w <= weight
                ? "bg-amber-500 text-white"
                : "bg-white/[0.04] text-gray-500 hover:bg-white/[0.08]"
            } ${readonly ? "cursor-default" : "cursor-pointer"}`}
          >
            {w}
          </button>
        ))}
      </div>
      <span className="text-xs text-gray-500">
        {weight}/{maxWeight} stars
      </span>
    </div>
  );
}
