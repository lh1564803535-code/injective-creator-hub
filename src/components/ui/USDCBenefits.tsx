"use client";

import { Zap, Shield, Globe, Clock, ArrowRight, DollarSign } from "lucide-react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function USDCBenefits() {
  const benefits = [
    {
      icon: Zap,
      title: "Instant Settlement",
      description:
        "Rewards are distributed in USDC the moment a campaign settles. No waiting for bank transfers or payment processors.",
      color: "amber",
      gradient: "from-amber-500 to-orange-600",
      glow: "shadow-amber-500/20",
    },
    {
      icon: Shield,
      title: "Stable Value",
      description:
        "USDC is pegged 1:1 to USD. Your earnings don't fluctuate with crypto market volatility — what you earn is what you keep.",
      color: "emerald",
      gradient: "from-emerald-500 to-green-600",
      glow: "shadow-emerald-500/20",
    },
    {
      icon: Globe,
      title: "Borderless Payouts",
      description:
        "Creators from anywhere in the world receive payments directly to their wallet. No bank account needed, no SWIFT delays.",
      color: "cyan",
      gradient: "from-cyan-500 to-blue-600",
      glow: "shadow-cyan-500/20",
    },
    {
      icon: Clock,
      title: "Real-Time Tracking",
      description:
        "Watch your earnings accumulate as votes come in. Every transaction is transparent and verifiable on the Injective blockchain.",
      color: "purple",
      gradient: "from-purple-500 to-pink-600",
      glow: "shadow-purple-500/20",
    },
  ];

  const colorMap: Record<string, { text: string; border: string; bg: string }> = {
    amber: {
      text: "text-amber-400",
      border: "hover:border-amber-500/20",
      bg: "bg-amber-500/10",
    },
    emerald: {
      text: "text-emerald-400",
      border: "hover:border-emerald-500/20",
      bg: "bg-emerald-500/10",
    },
    cyan: {
      text: "text-cyan-400",
      border: "hover:border-cyan-500/20",
      bg: "bg-cyan-500/10",
    },
    purple: {
      text: "text-purple-400",
      border: "hover:border-purple-500/20",
      bg: "bg-purple-500/10",
    },
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
          <DollarSign className="h-4 w-4" />
          Powered by USDC on Injective
        </div>
        <h2 className="text-2xl font-bold text-white">
          Instant, Stable, Global Payments
        </h2>
        <p className="mt-2 max-w-xl mx-auto text-sm text-gray-500">
          Every reward on Injective Creator Hub is paid in USDC — a fully
          reserved digital dollar. No volatility, no delays, no borders.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {benefits.map((benefit) => {
          const colors = colorMap[benefit.color];
          return (
            <div
              key={benefit.title}
              className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04] hover:shadow-lg ${colors.border}`}
            >
              {/* Corner glow */}
              <div
                className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${benefit.gradient} opacity-0 blur-3xl transition-opacity group-hover:opacity-10`}
              />

              <div className="relative flex gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors.bg}`}
                >
                  <benefit.icon className={`h-5 w-5 ${colors.text}`} />
                </div>
                <div>
                  <h3 className="mb-1.5 text-sm font-semibold text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-gray-500">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats bar */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-4">
        <div className="text-center">
          <p className="text-lg font-bold text-white">$4.2M+</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-600">
            USDC Distributed
          </p>
        </div>
        <div className="h-8 w-px bg-white/[0.06]" />
        <div className="text-center">
          <p className="text-lg font-bold text-white">1,200+</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-600">
            Creators Paid
          </p>
        </div>
        <div className="h-8 w-px bg-white/[0.06]" />
        <div className="text-center">
          <p className="text-lg font-bold text-white">&lt;2s</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-600">
            Settlement Time
          </p>
        </div>
        <div className="h-8 w-px bg-white/[0.06]" />
        <div className="text-center">
          <p className="text-lg font-bold text-white">$0</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-600">
            Gas for Claims
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 text-center">
        <Link
          href="/create"
          className="btn-glow inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25"
        >
          Start Earning USDC
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
