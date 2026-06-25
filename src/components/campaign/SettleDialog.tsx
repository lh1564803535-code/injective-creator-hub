"use client";

import { useState, useEffect } from "react";
import { X, Award, Loader2, Check, Users, TrendingUp } from "lucide-react";
import { formatUSDC, shortenAddress } from "@/lib/injective";
import { triggerSettleConfetti } from "@/components/creator/RewardAnimation";
import type { SubmissionData } from "@/lib/injective";

interface SettleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  campaignTitle: string;
  totalReward: bigint;
  submissions: SubmissionData[];
  onSettle?: () => void;
}

export function SettleDialog({
  isOpen,
  onClose,
  campaignTitle,
  totalReward,
  submissions,
  onSettle,
}: SettleDialogProps) {
  const [phase, setPhase] = useState<"preview" | "settling" | "success">("preview");

  // Calculate reward distribution (proportional to votes)
  const totalVotes = submissions.reduce((sum, s) => sum + s.votes, 0);
  const rewardDistribution = submissions.map((sub) => ({
    ...sub,
    rewardAmount:
      totalVotes > 0
        ? (totalReward * BigInt(sub.votes)) / BigInt(totalVotes)
        : BigInt(0),
    percentage: totalVotes > 0 ? (sub.votes / totalVotes) * 100 : 0,
  }));

  // Sort by votes descending
  rewardDistribution.sort((a, b) => b.votes - a.votes);

  const handleSettle = () => {
    setPhase("settling");
    // Simulate settlement delay
    setTimeout(() => {
      triggerSettleConfetti();
      setPhase("success");
      onSettle?.();
    }, 2000);
  };

  const handleClose = () => {
    setPhase("preview");
    onClose();
  };

  // Reset phase when dialog opens
  useEffect(() => {
    if (isOpen) setPhase("preview");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e0e18] shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-full p-1 text-gray-500 transition hover:bg-white/[0.06] hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="border-b border-white/[0.06] bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
              <Award className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {phase === "success" ? "Settlement Complete!" : "Settle Campaign?"}
              </h2>
              <p className="text-sm text-gray-400">{campaignTitle}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {phase === "preview" && (
            <>
              {/* Total reward */}
              <div className="mb-5 rounded-xl bg-amber-500/10 p-4 text-center">
                <p className="text-sm text-gray-400">Total Reward Pool</p>
                <p className="text-3xl font-bold text-amber-300">
                  {formatUSDC(totalReward)} <span className="text-lg">USDC</span>
                </p>
              </div>

              {/* Submission breakdown */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Reward Distribution</span>
                  <span className="text-gray-500">{submissions.length} submissions</span>
                </div>
                {rewardDistribution.map((sub, i) => (
                  <div
                    key={sub.id}
                    className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-3 transition hover:bg-white/[0.05]"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-xs font-bold text-gray-400">
                      {i + 1}
                    </span>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-xs font-bold text-white">
                      {sub.creator.slice(2, 4).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-sm text-white">
                        {shortenAddress(sub.creator)}
                      </p>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all"
                          style={{ width: `${sub.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-gray-500" />
                        <span className="text-sm text-gray-300">{sub.votes}</span>
                      </div>
                      <p className="text-sm font-semibold text-amber-400">
                        {formatUSDC(sub.rewardAmount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Settle button */}
              <button
                onClick={handleSettle}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3 font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:shadow-xl hover:shadow-amber-500/30"
              >
                Settle & Distribute Rewards
              </button>
            </>
          )}

          {phase === "settling" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-10 w-10 animate-spin text-amber-400" />
              <p className="text-gray-300">Settling campaign...</p>
              <p className="text-sm text-gray-500">Distributing rewards to creators</p>
            </div>
          )}

          {phase === "success" && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                <Check className="h-8 w-8 text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-white">
                  {formatUSDC(totalReward)} USDC Distributed
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Rewards sent to {submissions.length} creators
                </p>
              </div>
              <button
                onClick={handleClose}
                className="mt-2 rounded-xl bg-white/[0.06] px-6 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/[0.1] hover:text-white"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
