"use client";

import { Users, Shield } from "lucide-react";

interface MultiSigBadgeProps {
  threshold: number;
  signers: number;
  className?: string;
}

export function MultiSigBadge({
  threshold,
  signers,
  className = "",
}: MultiSigBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-1 ${className}`}>
      <Shield className="h-3 w-3 text-purple-400" />
      <span className="text-[10px] font-medium text-purple-400">
        {threshold}/{signers} Multi-sig
      </span>
    </div>
  );
}
