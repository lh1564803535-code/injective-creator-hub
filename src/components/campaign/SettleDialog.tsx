"use client";

import { useState, useEffect } from "react";
import { X, Award, Loader2, Check, TrendingUp, Zap, FileText, Coins } from "lucide-react";
import { formatUSDC, shortenAddress } from "@/lib/injective";
import { triggerSettleConfetti } from "@/components/creator/RewardAnimation";
import { TransactionPreview } from "@/components/ui/TransactionPreview";
import type { SubmissionData } from "@/hooks/useBounty";

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
  const [phase, setPhase] = useState<"preview" | "txPreview" | "settling" | "success">("preview");

  const totalVotes = submissions.reduce((sum, s) => sum + s.votes, 0);
  const rewardDistribution = submissions.map((sub) => ({
    ...sub,
    rewardAmount: totalVotes > 0 ? (totalReward * BigInt(sub.votes)) / BigInt(totalVotes) : BigInt(0),
    percentage: totalVotes > 0 ? (sub.votes / totalVotes) * 100 : 0,
  }));
  rewardDistribution.sort((a, b) => b.votes - a.votes);

  const handleSettle = () => {
    setPhase("settling");
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

  useEffect(() => {
    if (isOpen) setPhase("preview");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-[#2B3139] bg-[#1E2329] shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-full p-1 text-[#848E9C] transition hover:bg-[#2B3139] hover:text-[#EAECEF]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-[#2B3139] bg-gradient-to-r from-[#F0B90B]/10 via-[#F0B90B]/5 to-transparent p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0B90B]/15">
              <Award className="h-5 w-5 text-[#F0B90B]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#EAECEF]">
                {phase === "success" ? "Settlement Complete!" : "Settle Campaign?"}
              </h2>
              <p className="text-sm text-[#848E9C]">{campaignTitle}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {phase === "preview" && (
            <>
              <div className="mb-5 rounded-lg bg-[#F0B90B]/10 p-4 text-center">
                <p className="text-sm text-[#848E9C]">Total Reward Pool</p>
                <p className="font-mono text-3xl font-bold text-[#F0B90B]">
                  {formatUSDC(totalReward)} <span className="text-lg">USDC</span>
                </p>
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#848E9C]">Reward Distribution</span>
                  <span className="text-[#848E9C]">{submissions.length} submissions</span>
                </div>
                {rewardDistribution.map((sub, i) => (
                  <div
                    key={sub.id}
                    className="flex items-center gap-3 rounded-lg bg-[#0B0E11] p-3 transition hover:bg-[#2B3139]/50"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2B3139] text-xs font-bold text-[#848E9C]">
                      {i + 1}
                    </span>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00D4AA] to-[#00B894] text-xs font-bold text-white">
                      {sub.creator.slice(2, 4).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-sm text-[#EAECEF]">{shortenAddress(sub.creator)}</p>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#2B3139]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#F0B90B] to-[#F59E0B] transition-all"
                          style={{ width: `${sub.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-[#848E9C]" />
                        <span className="text-sm text-[#EAECEF]">{sub.votes}</span>
                      </div>
                      <p className="font-mono text-sm font-semibold text-[#F0B90B]">
                        {formatUSDC(sub.rewardAmount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setPhase("txPreview")}
                className="w-full rounded-xl bg-gradient-to-r from-[#F0B90B] to-[#F59E0B] py-3 font-semibold text-black shadow-lg shadow-[#F0B90B]/25 transition hover:shadow-xl hover:shadow-[#F0B90B]/30"
              >
                Review Settlement
              </button>
            </>
          )}

          {phase === "txPreview" && (
            <TransactionPreview
              title="Settle Campaign"
              target="BountyCampaign Contract"
              functionName={`settle(campaignId: ${submissions[0]?.campaignId ?? 0})`}
              steps={[
                { label: "Calculate Distribution", detail: `Distribute ${formatUSDC(totalReward)} USDC proportional to votes across ${submissions.length} submissions`, icon: Coins, color: "bg-[#F0B90B]/15 text-[#F0B90B]" },
                { label: "Transfer USDC", detail: "Batch USDC transfers from campaign pool to each creator", icon: Zap, color: "bg-[#00D4AA]/15 text-[#00D4AA]" },
                { label: "Mark Settled", detail: "Campaign marked as settled on-chain, no further votes accepted", icon: FileText, color: "bg-[#2B3139] text-[#848E9C]" },
              ]}
              balanceChanges={[
                ...rewardDistribution.slice(0, 3).map((sub) => ({
                  token: `USDC -> ${shortenAddress(sub.creator)}`,
                  amount: formatUSDC(sub.rewardAmount),
                  direction: "out" as const,
                })),
                ...(rewardDistribution.length > 3
                  ? [{ token: `+${rewardDistribution.length - 3} more recipients`, amount: "...", direction: "none" as const }]
                  : []),
              ]}
              estimatedGas={`~${(120000 + submissions.length * 65000).toLocaleString()} gas`}
              estimatedGasUSD={`~$${((120000 + submissions.length * 65000) * 0.0000004).toFixed(3)}`}
              riskLevel="warning"
              riskMessage={`Distributes ${formatUSDC(totalReward)} USDC to ${submissions.length} creators. This action is irreversible.`}
              contractVerified={true}
              onConfirm={handleSettle}
              onCancel={() => setPhase("preview")}
              isProcessing={false}
            />
          )}

          {phase === "settling" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-10 w-10 animate-spin text-[#F0B90B]" />
              <p className="text-[#EAECEF]">Settling campaign...</p>
              <p className="text-sm text-[#848E9C]">Distributing rewards to creators</p>
            </div>
          )}

          {phase === "success" && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00D4AA]/15">
                <Check className="h-8 w-8 text-[#00D4AA]" />
              </div>
              <div className="text-center">
                <p className="font-mono text-lg font-semibold text-[#EAECEF]">
                  {formatUSDC(totalReward)} USDC Distributed
                </p>
                <p className="mt-1 text-sm text-[#848E9C]">
                  Rewards sent to {submissions.length} creators
                </p>
              </div>
              <button
                onClick={handleClose}
                className="mt-2 rounded-lg bg-[#2B3139] px-6 py-2.5 text-sm font-medium text-[#EAECEF] transition hover:bg-[#2B3139]/80"
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
