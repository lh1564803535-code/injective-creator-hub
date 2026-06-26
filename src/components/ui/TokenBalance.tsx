"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Copy, Check, Wallet, Coins } from "lucide-react";

interface BalanceData {
  inj: string;
  usdc: string;
  address: string;
}

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: string; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const target = parseFloat(value);
    if (isNaN(target)) {
      setDisplay(value);
      return;
    }
    const start = parseFloat(display) || 0;
    const duration = 600;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;
      setDisplay(current.toFixed(4));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span className="tabular-nums">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export function TokenBalance({
  injBalance = "0.0000",
  usdcBalance = "0.0000",
  address = "",
  onRefresh,
}: {
  injBalance?: string;
  usdcBalance?: string;
  address?: string;
  onRefresh?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [address]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    onRefresh?.();
    setTimeout(() => setRefreshing(false), 1000);
  }, [onRefresh]);

  const truncated = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "Not connected";

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-medium text-gray-400">Wallet</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition"
            title="Refresh balances"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/[0.06] transition"
            title="Copy address"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-600 mb-4 font-mono">{truncated}</div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/10">
              <Coins className="h-4 w-4 text-cyan-400" />
            </div>
            <span className="text-sm text-gray-400">INJ</span>
          </div>
          <span className="text-lg font-semibold text-white">
            <AnimatedNumber value={injBalance} suffix=" INJ" />
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
              <span className="text-sm font-bold text-emerald-400">$</span>
            </div>
            <span className="text-sm text-gray-400">USDC</span>
          </div>
          <span className="text-lg font-semibold text-white">
            <AnimatedNumber value={usdcBalance} suffix=" USDC" />
          </span>
        </div>
      </div>
    </div>
  );
}
