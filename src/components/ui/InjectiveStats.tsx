"use client";

import { useState, useEffect } from "react";
import { Activity, Clock, Zap, TrendingUp, Globe, Users } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  change?: string;
  icon: typeof Activity;
  color: string;
}

export function InjectiveStats() {
  const [stats, setStats] = useState<StatItem[]>([
    { label: "Block Time", value: "0.64s", icon: Clock, color: "text-amber-400" },
    { label: "TPS", value: "10,000+", icon: Zap, color: "text-cyan-400" },
    { label: "Total Txns", value: "1.2B+", icon: Activity, color: "text-emerald-400" },
    { label: "Gas Fee", value: "$0.00008", icon: TrendingUp, color: "text-purple-400" },
    { label: "Chains", value: "40+", icon: Globe, color: "text-pink-400" },
    { label: "Ecosystem", value: "30+ dApps", icon: Users, color: "text-orange-400" },
  ]);

  // Simulate TPS changes
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) =>
        prev.map((stat) => {
          if (stat.label === "TPS") {
            const tps = 9000 + Math.floor(Math.random() * 2000);
            return { ...stat, value: tps.toLocaleString() + "+" };
          }
          return stat;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="flex flex-col items-center rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center transition hover:bg-white/[0.04]"
          >
            <Icon className={`mb-1 h-5 w-5 ${stat.color}`} />
            <p className="font-mono text-lg font-bold text-white">{stat.value}</p>
            <p className="text-[10px] text-gray-500">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
