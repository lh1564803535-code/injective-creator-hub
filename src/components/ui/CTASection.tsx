"use client";

import Link from "next/link";
import { ArrowRight, Rocket, Zap } from "lucide-react";
import { PoweredByInjective } from "./PoweredByInjective";

export function CTASection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 p-8 lg:p-12">
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-400">
          <Rocket className="h-4 w-4" />
          Join the Creator Revolution
        </div>

        <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
          Start Earning USDC{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Today
          </span>
        </h2>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400">
          Create campaigns, submit content, vote on submissions, and earn real USDC rewards —
          all on-chain, all in real-time, all on Injective.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/campaigns"
            className="btn-glow flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-cyan-500/25"
          >
            Explore Campaigns
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/create"
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-8 py-4 text-lg font-semibold text-white hover:bg-white/[0.06]"
          >
            <Zap className="h-5 w-5 text-amber-400" />
            Create Campaign
          </Link>
        </div>

        <div className="mt-8">
          <PoweredByInjective variant="inline" />
        </div>
      </div>
    </section>
  );
}
