"use client";

import { useState, useEffect } from "react";
import { X, Vote, Loader2, Check, ExternalLink, Star, Shield, Zap, FileText } from "lucide-react";
import { shortenAddress } from "@/lib/injective";
import { TransactionPreview } from "@/components/ui/TransactionPreview";
import type { SubmissionData } from "@/lib/injective";

interface VoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  submission: SubmissionData | null;
  onVote?: (submissionId: number, weight: number) => void;
}

export function VoteDialog({
  isOpen,
  onClose,
  submission,
  onVote,
}: VoteDialogProps) {
  const [weight, setWeight] = useState(3);
  const [phase, setPhase] = useState<"select" | "preview" | "voting" | "success">("select");

  // Reset when dialog opens
  useEffect(() => {
    if (isOpen) {
      setWeight(3);
      setPhase("select");
    }
  }, [isOpen]);

  if (!isOpen || !submission) return null;

  const handlePreview = () => {
    setPhase("preview");
  };

  const handleVote = () => {
    setPhase("voting");
    // Simulate voting delay
    setTimeout(() => {
      setPhase("success");
      onVote?.(submission.id, weight);
    }, 1500);
  };

  const handleClose = () => {
    setPhase("select");
    onClose();
  };

  const weightLabels: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Great",
    5: "Excellent",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e0e18] shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-full p-1 text-gray-500 transition hover:bg-white/[0.06] hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="border-b border-white/[0.06] bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15">
              <Vote className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {phase === "success" ? "Vote Recorded!" : "Cast Your Vote"}
              </h2>
              <p className="text-sm text-gray-400">Submission #{submission.id}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {phase === "select" && (
            <>
              {/* Submission info */}
              <div className="mb-5 rounded-xl bg-white/[0.03] p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-white">
                    {submission.creator.slice(2, 4).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-mono text-sm text-white">
                      {shortenAddress(submission.creator)}
                    </p>
                    <a
                      href={submission.contentURI}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                    >
                      View Content <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className="font-semibold text-white">{submission.votes}</span> current votes
                </div>
              </div>

              {/* Weight selector */}
              <div className="mb-6">
                <p className="mb-3 text-sm text-gray-400">Rate this submission</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeight(w)}
                      className={`group flex flex-1 flex-col items-center gap-1 rounded-xl py-3 transition-all ${
                        weight === w
                          ? "bg-cyan-500/15 ring-1 ring-cyan-500/30"
                          : "bg-white/[0.03] hover:bg-white/[0.06]"
                      }`}
                    >
                      <Star
                        className={`h-5 w-5 transition ${
                          weight >= w
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-600"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          weight === w ? "text-cyan-300" : "text-gray-500"
                        }`}
                      >
                        {w}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-center text-sm text-gray-500">
                  {weightLabels[weight]}
                </p>
              </div>

              {/* Vote button */}
              <button
                onClick={handlePreview}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-xl hover:shadow-cyan-500/30"
              >
                Review Vote
              </button>
            </>
          )}

          {phase === "preview" && (
            <TransactionPreview
              title="Cast Vote"
              target="BountyCampaign Contract"
              functionName={`vote(submissionId: ${submission.id}, weight: ${weight})`}
              steps={[
                { label: "Approve Vote", detail: `Cast ${weight}x weighted vote for submission #${submission.id}`, icon: Vote, color: "bg-cyan-500/15 text-cyan-400" },
                { label: "Record On-Chain", detail: "Vote recorded in BountyCampaign smart contract", icon: FileText, color: "bg-blue-500/15 text-blue-400" },
                { label: "Update Rankings", detail: "Submission vote count and leaderboard updated", icon: Zap, color: "bg-emerald-500/15 text-emerald-400" },
              ]}
              balanceChanges={[
                { token: "INJ", amount: "~0.001", direction: "out", usdValue: "~$0.02 gas" },
                { token: "Voting Power", amount: `${weight}x`, direction: "none" },
              ]}
              estimatedGas="~45,000 gas"
              estimatedGasUSD="~$0.02"
              riskLevel="safe"
              riskMessage="Standard vote transaction. No token transfers."
              contractVerified={true}
              onConfirm={handleVote}
              onCancel={() => setPhase("select")}
            />
          )}

          {phase === "voting" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
              <p className="text-gray-300">Recording your vote...</p>
            </div>
          )}

          {phase === "success" && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                <Check className="h-8 w-8 text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-white">Vote Recorded!</p>
                <p className="mt-1 text-sm text-gray-400">
                  You voted with <span className="text-cyan-400 font-semibold">{weight}x</span> weight
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
