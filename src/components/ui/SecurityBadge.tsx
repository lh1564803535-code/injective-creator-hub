"use client";

import { Shield, CheckCircle, Globe, Zap } from "lucide-react";

interface SecurityBadgeItem {
  id: string;
  icon: typeof Shield;
  title: string;
  description: string;
  color: "green" | "blue" | "gold";
}

const BADGES: SecurityBadgeItem[] = [
  {
    id: "contract-verified",
    icon: CheckCircle,
    title: "Contract Verified",
    description: "Source code verified on Injective Explorer. Full transparency for all transactions.",
    color: "green",
  },
  {
    id: "security-audit",
    icon: Shield,
    title: "Security Audited",
    description: "Smart contracts audited for vulnerabilities. Battle-tested on mainnet.",
    color: "blue",
  },
  {
    id: "decentralized",
    icon: Globe,
    title: "Fully Decentralized",
    description: "No central authority. Governance and rewards distributed on-chain.",
    color: "gold",
  },
  {
    id: "instant-settlement",
    icon: Zap,
    title: "Instant Settlement",
    description: "Rewards settled in real-time via Injective's sub-second finality.",
    color: "green",
  },
];

const colorStyles = {
  green: {
    iconBg: "bg-emerald-500/15",
    iconText: "text-emerald-400",
    border: "border-emerald-500/20",
    glow: "shadow-emerald-500/5",
  },
  blue: {
    iconBg: "bg-cyan-500/15",
    iconText: "text-cyan-400",
    border: "border-cyan-500/20",
    glow: "shadow-cyan-500/5",
  },
  gold: {
    iconBg: "bg-amber-500/15",
    iconText: "text-amber-400",
    border: "border-amber-500/20",
    glow: "shadow-amber-500/5",
  },
};

export function SecurityBadge() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {BADGES.map((badge) => {
        const styles = colorStyles[badge.color];
        const Icon = badge.icon;

        return (
          <div
            key={badge.id}
            className={`rounded-2xl border ${styles.border} bg-white/[0.02] p-5 shadow-lg ${styles.glow} transition hover:bg-white/[0.04]`}
          >
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${styles.iconBg}`}
            >
              <Icon className={`h-6 w-6 ${styles.iconText}`} />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-white">
              {badge.title}
            </h3>
            <p className="text-xs leading-relaxed text-gray-500">
              {badge.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
