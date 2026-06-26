"use client";

import { useEffect, useState, useRef } from "react";
import { TrendingUp, Users, Trophy, DollarSign, Zap, Globe } from "lucide-react";

interface Stat {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: typeof TrendingUp;
  color: string;
  description: string;
}

const STATS: Stat[] = [
  {
    label: "Total Rewards Distributed",
    value: 125000,
    prefix: "$",
    icon: DollarSign,
    color: "text-emerald-400",
    description: "USDC paid to creators",
  },
  {
    label: "Active Creators",
    value: 156,
    icon: Users,
    color: "text-cyan-400",
    description: "Earning on Injective",
  },
  {
    label: "Campaigns Completed",
    value: 42,
    icon: Trophy,
    color: "text-amber-400",
    description: "Successful bounties",
  },
  {
    label: "Avg. Block Time",
    value: 1.2,
    suffix: "s",
    icon: Zap,
    color: "text-purple-400",
    description: "Lightning fast finality",
  },
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
          const duration = 2000;

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

  const formatted = Number.isInteger(value) ? Math.floor(display).toLocaleString() : display.toFixed(1);

  return (
    <span ref={ref} className="font-mono">
      {prefix}{formatted}{suffix}
    </span>
  );
}

export function HomepageStats() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {STATS.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-center transition hover:bg-white/[0.04]"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04]">
              <Icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-white">
              <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            </p>
            <p className="mt-1 text-sm font-medium text-gray-300">{stat.label}</p>
            <p className="mt-0.5 text-xs text-gray-500">{stat.description}</p>
          </div>
        );
      })}
    </div>
  );
}
