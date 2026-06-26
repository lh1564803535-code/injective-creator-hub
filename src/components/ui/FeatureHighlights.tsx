"use client";

import { Bot, Zap, Shield, Globe, Clock, Users } from "lucide-react";

const FEATURES = [
  {
    icon: Bot,
    title: "AI-Powered Assistant",
    description: "Natural language commands for wallet management, campaign participation, and blockchain interactions",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Zap,
    title: "Real-Time Streaming",
    description: "Earnings flow every second using Superfluid-inspired technology. Watch your balance grow in real-time",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Shield,
    title: "Transaction Preview",
    description: "Review every transaction before signing. Risk assessment, gas estimates, and safety checks",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Globe,
    title: "Cross-Chain Ready",
    description: "Built on Injective EVM with IBC support. Bridge assets and interact across 40+ chains",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Clock,
    title: "Instant Finality",
    description: "Sub-second block times with 1.2s finality. No waiting for confirmations",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    icon: Users,
    title: "Community Governance",
    description: "Decentralized campaign creation, voting, and reward distribution. Power to the creators",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
];

export function FeatureHighlights() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map((feature) => {
        const Icon = feature.icon;
        return (
          <div
            key={feature.title}
            className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition hover:bg-white/[0.04]"
          >
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}>
              <Icon className={`h-6 w-6 ${feature.color}`} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
            <p className="text-sm text-gray-400">{feature.description}</p>
          </div>
        );
      })}
    </div>
  );
}
