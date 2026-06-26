"use client";

import { useState, useEffect } from "react";
import { Zap, ArrowRight, DollarSign, ChevronDown } from "lucide-react";
import { formatUSDC, shortenAddress } from "@/lib/injective";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PaymentStreamEntry {
  id: number;
  from: string; // campaign title or sponsor
  to: string; // creator address
  amount: bigint;
  timestamp: number;
  type: "reward" | "claim" | "tip";
}

interface PaymentStreamProps {
  payments: PaymentStreamEntry[];
  maxVisible?: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeAgo(timestamp: number): string {
  const diff = Math.floor(Date.now() / 1000) - timestamp;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const typeConfig = {
  reward: {
    label: "Reward",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    dot: "bg-amber-400",
    glow: "shadow-amber-500/20",
  },
  claim: {
    label: "Claimed",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    dot: "bg-emerald-400",
    glow: "shadow-emerald-500/20",
  },
  tip: {
    label: "Tip",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    dot: "bg-purple-400",
    glow: "shadow-purple-500/20",
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PaymentStream({ payments, maxVisible = 6 }: PaymentStreamProps) {
  const [visibleCount, setVisibleCount] = useState(maxVisible);
  const [newPaymentFlash, setNewPaymentFlash] = useState<number | null>(null);

  const totalFlow = payments.reduce((sum, p) => sum + p.amount, BigInt(0));
  const visiblePayments = payments.slice(0, visibleCount);

  // Flash effect for new payments (simulated)
  useEffect(() => {
    if (payments.length > 0) {
      setNewPaymentFlash(payments[0].id);
      const timer = setTimeout(() => setNewPaymentFlash(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [payments.length]);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Payment Stream</h3>
            <p className="text-[10px] text-gray-500">Live USDC flow</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-emerald-400">
            {formatUSDC(totalFlow)} USDC
          </p>
          <p className="text-[10px] text-gray-600">total distributed</p>
        </div>
      </div>

      {/* Live indicator */}
      <div className="mb-4 flex items-center gap-2 rounded-lg bg-white/[0.02] px-3 py-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="text-xs text-gray-400">
          {payments.length} payments flowing to creators
        </span>
      </div>

      {/* Payment entries */}
      <div className="space-y-2">
        {visiblePayments.map((payment, i) => {
          const config = typeConfig[payment.type];
          const isNew = newPaymentFlash === payment.id;

          return (
            <div
              key={payment.id}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all ${
                isNew
                  ? `border-emerald-500/30 bg-emerald-500/5 ${config.glow} shadow-lg`
                  : "border-white/[0.04] bg-white/[0.015] hover:bg-white/[0.03]"
              }`}
              style={{
                animation: isNew ? "fade-in-up 0.3s ease-out" : undefined,
              }}
            >
              {/* Type indicator */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bg}`}
              >
                <DollarSign className={`h-4 w-4 ${config.color}`} />
              </div>

              {/* Flow info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="truncate font-medium text-gray-300">
                    {payment.from.length > 20
                      ? payment.from.slice(0, 20) + "..."
                      : payment.from}
                  </span>
                  <ArrowRight className="h-3 w-3 shrink-0 text-gray-600" />
                  <span className="truncate font-mono text-gray-400">
                    {shortenAddress(payment.to)}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${config.bg} ${config.color}`}
                  >
                    <span className={`h-1 w-1 rounded-full ${config.dot}`} />
                    {config.label}
                  </span>
                  <span className="text-[10px] text-gray-600">
                    {timeAgo(payment.timestamp)}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div className="shrink-0 text-right">
                <p className={`text-sm font-semibold ${config.color}`}>
                  +{formatUSDC(payment.amount)}
                </p>
                <p className="text-[10px] text-gray-600">USDC</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more */}
      {payments.length > visibleCount && (
        <button
          onClick={() => setVisibleCount((prev) => prev + maxVisible)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] py-2 text-xs text-gray-400 transition hover:bg-white/[0.04] hover:text-gray-300"
        >
          Show more
          <ChevronDown className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
