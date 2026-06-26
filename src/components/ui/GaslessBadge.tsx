"use client";

import { Zap } from "lucide-react";

interface GaslessBadgeProps {
  sponsored?: boolean;
  className?: string;
}

export function GaslessBadge({ sponsored = true, className = "" }: GaslessBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
      sponsored
        ? "bg-emerald-500/10 text-emerald-400"
        : "bg-gray-500/10 text-gray-400"
    } ${className}`}>
      <Zap className="h-3 w-3" />
      <span className="text-[10px] font-medium">
        {sponsored ? "Gas Sponsored" : "Gas Required"}
      </span>
    </div>
  );
}
