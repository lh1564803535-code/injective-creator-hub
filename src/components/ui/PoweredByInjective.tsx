"use client";

import { Zap } from "lucide-react";

interface PoweredByInjectiveProps {
  variant?: "badge" | "footer" | "inline";
}

export function PoweredByInjective({ variant = "badge" }: PoweredByInjectiveProps) {
  if (variant === "footer") {
    return (
      <div className="flex items-center justify-center gap-2 py-4">
        <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-4 py-2">
          <Zap className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-medium text-gray-400">Powered by</span>
          <span className="text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Injective
          </span>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-gray-500">
        <Zap className="h-3 w-3 text-cyan-400" />
        Built on Injective
      </span>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5">
      <Zap className="h-4 w-4 text-cyan-400" />
      <div>
        <p className="text-[10px] text-gray-500">Powered by</p>
        <p className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Injective
        </p>
      </div>
    </div>
  );
}
