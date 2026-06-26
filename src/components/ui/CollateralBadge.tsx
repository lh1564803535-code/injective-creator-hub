"use client";

import { Shield, AlertTriangle } from "lucide-react";

interface CollateralBadgeProps {
  asset: string;
  ltv: number;
  healthFactor?: number;
  className?: string;
}

export function CollateralBadge({
  asset,
  ltv,
  healthFactor,
  className = "",
}: CollateralBadgeProps) {
  const isHealthy = !healthFactor || healthFactor > 1.5;
  const isWarning = healthFactor && healthFactor > 1.0 && healthFactor <= 1.5;
  const isDanger = healthFactor && healthFactor <= 1.0;

  return (
    <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 ${
      isDanger
        ? "border-red-500/20 bg-red-500/5"
        : isWarning
        ? "border-amber-500/20 bg-amber-500/5"
        : "border-white/[0.06] bg-white/[0.02]"
    } ${className}`}>
      <Shield className={`h-4 w-4 ${isDanger ? "text-red-400" : isWarning ? "text-amber-400" : "text-gray-400"}`} />
      <div>
        <p className="text-xs font-medium text-white">{asset}</p>
        <p className="text-[10px] text-gray-500">LTV: {ltv}%</p>
      </div>
      {healthFactor !== undefined && (
        <div className={`ml-auto flex items-center gap-1 ${isDanger ? "text-red-400" : isWarning ? "text-amber-400" : "text-emerald-400"}`}>
          {isDanger ? <AlertTriangle className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
          <span className="text-[10px] font-medium">{healthFactor.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}
