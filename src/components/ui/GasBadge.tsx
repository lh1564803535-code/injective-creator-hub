"use client";

import { Fuel } from "lucide-react";

interface GasBadgeProps {
  gas?: string;
  usd?: string;
  className?: string;
}

export function GasBadge({
  gas = "0.000003 INJ",
  usd = "$0.00008",
  className = "",
}: GasBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 ${className}`}>
      <Fuel className="h-3 w-3 text-emerald-400" />
      <span className="text-[10px] font-medium text-emerald-400">{gas}</span>
      <span className="text-[10px] text-gray-500">({usd})</span>
    </div>
  );
}
