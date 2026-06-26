"use client";

import { Activity, Clock, Zap } from "lucide-react";

interface StreamStatusProps {
  rate: string;
  unit?: string;
  active?: boolean;
  uptime?: string;
  className?: string;
}

export function StreamStatus({
  rate,
  unit = "/sec",
  active = true,
  uptime,
  className = "",
}: StreamStatusProps) {
  return (
    <div className={`rounded-lg border ${active ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/[0.06] bg-white/[0.02]"} px-3 py-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className={`h-4 w-4 ${active ? "text-emerald-400" : "text-gray-400"}`} />
          <div>
            <p className="text-xs text-gray-500">Stream Rate</p>
            <p className={`text-sm font-bold ${active ? "text-emerald-400" : "text-gray-400"}`}>
              {rate}{unit}
            </p>
          </div>
        </div>
        {uptime && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>{uptime}</span>
          </div>
        )}
      </div>
    </div>
  );
}
