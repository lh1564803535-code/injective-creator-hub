"use client";

import { useState, useEffect } from "react";
import { X, Vote, Loader2, Check, ExternalLink, Star, Zap, FileText } from "lucide-react";
import { shortenAddress } from "@/lib/injective";
import { TransactionPreview } from "@/components/ui/TransactionPreview";
import type { SubmissionData } from "@/hooks/useBounty";

interface VoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  submission: SubmissionData | null;
  onVote?: (submissionId: number, weight: number) => void;
}

export function VoteDialog({ isOpen, onClose, submission, onVote }: VoteDialogProps) {
  const [weight, setWeight] = useState(3);
  const [phase, setPhase] = useState<"select" | "preview" | "voting" | "success">("select");

  useEffect(() => {
    if (isOpen) { setWeight(3); setPhase("select"); }
  }, [isOpen]);

  if (!isOpen || !submission) return null;

  const handlePreview = () => setPhase("preview");
  const handleVote = () => {
    setPhase("voting");
    setTimeout(() => { setPhase("success"); onVote?.(submission.id, weight); }, 1500);
  };
  const handleClose = () => { setPhase("select"); onClose(); };

  const weightLabels: Record<number, string> = { 1: "Poor", 2: "Fair", 3: "Good", 4: "Great", 5: "Excellent" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-[#2B3139] bg-[#1E2329] shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-full p-1 text-[#848E9C] transition hover:bg-[#2B3139] hover:text-[#EAECEF]"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-[#2B3139] bg-gradient-to-r from-[#00D4AA]/10 via-[#00D4AA]/5 to-transparent p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00D4AA]/15">
              <Vote className="h-5 w-5 text-[#00D4AA]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#EAECEF]">
                {phase === "success" ? "Vote Recorded!" : "Cast Your Vote"}
              </h2>
              <p className="text-sm text-[#848E9C]">Submission #{submission.id}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {phase === "select" && (
            <>
              <div className="mb-5 rounded-lg bg-[#0B0E11] p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#00D4AA] to-[#00B894] text-sm font-bold text-white">
                    {submission.creator.slice(2, 4).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-mono text-sm text-[#EAECEF]">{shortenAddress(submission.creator)}</p>
                    <a
                      href={submission.contentURI}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-[#00D4AA] hover:text-[#00D4AA]/80"
                    >
                      View Content <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#848E9C]">
                  <span className="font-semibold text-[#EAECEF]">{submission.votes}</span> current votes
                </div>
              </div>

              <div className="mb-6">
                <p className="mb-3 text-sm text-[#848E9C]">Rate this submission</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeight(w)}
                      className={`group flex flex-1 flex-col items-center gap-1 rounded-lg py-3 transition-all ${
                        weight === w
                          ? "bg-[#00D4AA]/15 ring-1 ring-[#00D4AA]/30"
                          : "bg-[#0B0E11] hover:bg-[#2B3139]"
                      }`}
                    >
                      <Star
                        className={`h-5 w-5 transition ${
                          weight >= w ? "fill-[#F0B90B] text-[#F0B90B]" : "text-[#848E9C]"
                        }`}
                      />
                      <span className={`text-xs font-medium ${weight === w ? "text-[#00D4AA]" : "text-[#848E9C]"}`}>
                        {w}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-center text-sm text-[#848E9C]">{weightLabels[weight]}</p>
              </div>

              <button
                onClick={handlePreview}
                className="w-full rounded-xl bg-[#00D4AA] py-3 font-semibold text-white shadow-lg shadow-[#00D4AA]/25 transition hover:shadow-xl hover:shadow-[#00D4AA]/30"
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
                { label: "Approve Vote", detail: `Cast ${weight}x weighted vote for submission #${submission.id}`, icon: Vote, color: "bg-[#00D4AA]/15 text-[#00D4AA]" },
                { label: "Record On-Chain", detail: "Vote recorded in BountyCampaign smart contract", icon: FileText, color: "bg-[#2B3139] text-[#848E9C]" },
                { label: "Update Rankings", detail: "Submission vote count and leaderboard updated", icon: Zap, color: "bg-[#00D4AA]/15 text-[#00D4AA]" },
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
              <Loader2 className="h-10 w-10 animate-spin text-[#00D4AA]" />
              <p className="text-[#EAECEF]">Recording your vote...</p>
            </div>
          )}

          {phase === "success" && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00D4AA]/15">
                <Check className="h-8 w-8 text-[#00D4AA]" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-[#EAECEF]">Vote Recorded!</p>
                <p className="mt-1 text-sm text-[#848E9C]">
                  You voted with <span className="font-semibold text-[#00D4AA]">{weight}x</span> weight
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
