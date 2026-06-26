"use client";

import { Shield, Zap, Users } from "lucide-react";

interface SmartWalletBadgeProps {
  features?: string[];
  className?: string;
}

const defaultFeatures = [
  { icon: Zap, label: "Gasless", desc: "No gas fees" },
  { icon: Shield, label: "Social Recovery", desc: "No seed phrase" },
  { icon: Users, label: "Multi-sig", desc: "Shared control" },
];

export function SmartWalletBadge({
  features,
  className = "",
}: SmartWalletBadgeProps) {
  const displayFeatures = features
    ? features.map((f, i) => ({ icon: Shield, label: f, desc: "" }))
    : defaultFeatures;

  return (
    <div className={`rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 ${className}`}>
      <div className="mb-2 flex items-center gap-2">
        <Shield className="h-4 w-4 text-cyan-400" />
        <span className="text-xs font-medium text-cyan-400">Smart Wallet</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {displayFeatures.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-1.5 rounded-full bg-white/[0.04] px-2.5 py-1"
            >
              <Icon className="h-3 w-3 text-gray-400" />
              <span className="text-[10px] text-gray-300">{feature.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
