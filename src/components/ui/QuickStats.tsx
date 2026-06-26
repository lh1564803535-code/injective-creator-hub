"use client";

import { useEffect, useState, useRef } from "react";
import { TrendingUp, Users, Trophy, DollarSign, Zap, Clock } from "lucide-react";

interface Stat {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: typeof TrendingUp;
  color: string;
  trend?: string;
}

const STATS: Stat[] = [
  { label: "Total Earnings", value: 1245.67, prefix: "$", icon: DollarSign, color: "text-emerald-400", trend: "+23%" },
  { label: "Active Campaigns", value: 8, icon: Trophy, color: "text-amber-400", trend: "+2" },
  { label: "Community Members", value: 156, icon: Users, color: "text-cyan-400", trend: "+12" },
  { label: "Avg. Block Time", value: 1.2, suffix: "s", icon: Clock, color: "text-purple-400" },
];

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const duration = 1500;

          function update(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(value * eased);
            if (progress < 1) requestAnimationFrame(update);
          }

          requestAnimationFrame(update);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  const formatted = Number.isInteger(value) ? Math.floor(display).toLocaleString() : display.toFixed(2);

  return (
    <span ref={ref} className="font-mono">
      {prefix}{formatted}{suffix}
    </span>
  );
}

export function QuickStats() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STATS.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:bg-white/[0.04]"
          >
            <div className="mb-2 flex items-center justify-between">
              <Icon className={`h-5 w-5 ${stat.color}`} />
              {stat.trend && (
                <span className="flex items-center gap-0.5 text-[10px] text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-white">
              <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            </p>
            <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
