"use client";

import { Shield, Lock, CheckCircle } from "lucide-react";

interface ZKProofBadgeProps {
  type: "snark" | "stark" | "plonk";
  verified?: boolean;
  label?: string;
  className?: string;
}

const typeConfig = {
  snark: { name: "zk-SNARK", color: "text-cyan-400 bg-cyan-500/10", desc: "Compact proofs" },
  stark: { name: "zk-STARK", color: "text-purple-400 bg-purple-500/10", desc: "Scalable & transparent" },
  plonk: { name: "PLONK", color: "text-amber-400 bg-amber-500/10", desc: "Universal setup" },
};

export function ZKProofBadge({
  type,
  verified = false,
  label,
  className = "",
}: ZKProofBadgeProps) {
  const config = typeConfig[type];

  return (
    <div className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 ${
      verified ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/[0.06] bg-white/[0.02]"
    } ${className}`}>
      <Shield className={`h-4 w-4 ${verified ? "text-emerald-400" : "text-gray-400"}`} />
      <div>
        <p className="text-xs font-medium text-white">{label || config.name}</p>
        <p className="text-[10px] text-gray-500">{config.desc}</p>
      </div>
      {verified && <CheckCircle className="h-4 w-4 text-emerald-400" />}
    </div>
  );
}
