"use client";

import { Activity, Wifi, WifiOff } from "lucide-react";

interface LiveIndicatorProps {
  connected?: boolean;
  label?: string;
  showIcon?: boolean;
  className?: string;
}

export function LiveIndicator({
  connected = true,
  label,
  showIcon = true,
  className = "",
}: LiveIndicatorProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {showIcon && (
        connected ? (
          <Activity className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <WifiOff className="h-3.5 w-3.5 text-red-400" />
        )
      )}
      <span className={`h-2 w-2 rounded-full animate-pulse ${
        connected ? "bg-emerald-400" : "bg-red-400"
      }`} />
      <span className={`text-xs font-medium ${
        connected ? "text-emerald-400" : "text-red-400"
      }`}>
        {label || (connected ? "Live" : "Offline")}
      </span>
    </div>
  );
}
