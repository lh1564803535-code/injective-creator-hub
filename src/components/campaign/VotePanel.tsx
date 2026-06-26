"use client";

import { useState, useCallback } from "react";
import {
  Star,
  ExternalLink,
  Check,
  Loader2,
  X,
} from "lucide-react";
import { shortenAddress } from "@/lib/injective";
import type { Submission } from "@/types/creator-settlement";

interface VotePanelProps {
  submissions: Submission[];
  explorerBaseUrl?: string;
  onVote?: (submissionId: number, weight: number) => void;
}

type Phase = "idle" | "confirm" | "voting" | "success";

export function VotePanel({
  submissions,
  explorerBaseUrl = "https://explorer.injective.network",
  onVote,
}: VotePanelProps) {
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [weight, setWeight] = useState(3);
  const [phase, setPhase] = useState<Phase>("idle");
  const [txHash, setTxHash] = useState<string | null>(null);

  const weightLabels: Record<number, string> = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Great",
    5: "Excellent",
  };

  const handleSelectVote = useCallback((submission: Submission) => {
    setSelectedSubmission(submission);
    setWeight(3);
    setPhase("confirm");
  }, []);

  const handleConfirmVote = useCallback(() => {
    if (!selectedSubmission) return;
    setPhase("voting");

    // Simulate on-chain vote
    setTimeout(() => {
      const mockTxHash =
        "0x" +
        Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("");
      setTxHash(mockTxHash);
      setPhase("success");
      onVote?.(selectedSubmission.id, weight);
    }, 1800);
  }, [selectedSubmission, weight, onVote]);

  const handleReset = useCallback(() => {
    setSelectedSubmission(null);
    setWeight(3);
    setTxHash(null);
    setPhase("idle");
  }, []);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Submissions</h3>
          <p className="mt-0.5 text-sm text-gray-500">
            {submissions.length} submission{submissions.length !== 1 ? "s" : ""} to review
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-400" />
          <span className="text-sm text-gray-400">Rate 1-5 stars</span>
        </div>
      </div>

      {/* Submission List */}
      <div className="space-y-3">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 transition hover:bg-white/[0.04]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white">
                {submission.creator.slice(2, 4).toUpperCase()}
              </div>
              <div>
                <p className="font-mono text-sm text-white">
                  {shortenAddress(submission.creator)}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {submission.votes} votes
                  </span>
                  <a
                    href={submission.contentURI}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectVote(submission)}
              disabled={submission.claimed}
              className="flex items-center gap-2 rounded-xl bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Star className="h-4 w-4" />
              Vote
            </button>
          </div>
        ))}
      </div>

      {/* Confirm Dialog */}
      {phase === "confirm" && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e0e18] p-6 shadow-2xl">
            <button
              onClick={handleReset}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-500 transition hover:bg-white/[0.06] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h4 className="mb-1 text-lg font-semibold text-white">
              Confirm Vote
            </h4>
            <p className="mb-5 text-sm text-gray-400">
              Voting for{" "}
              <span className="font-mono text-white">
                {shortenAddress(selectedSubmission.creator)}
              </span>
            </p>

            {/* Star selector */}
            <div className="mb-6">
              <p className="mb-3 text-sm text-gray-400">Select rating</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((w) => (
                  <button
                    key={w}
                    onClick={() => setWeight(w)}
                    className={`group flex flex-1 flex-col items-center gap-1 rounded-xl py-3 transition-all ${
                      weight === w
                        ? "bg-amber-500/15 ring-1 ring-amber-500/30"
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
                        weight === w ? "text-amber-300" : "text-gray-500"
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

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/[0.06]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmVote}
                className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:shadow-xl hover:shadow-cyan-500/30"
              >
                Cast Vote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voting Loader */}
      {phase === "voting" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#0e0e18] p-8 shadow-2xl">
            <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
            <p className="text-gray-300">Recording your vote on-chain...</p>
          </div>
        </div>
      )}

      {/* Success */}
      {phase === "success" && txHash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0e0e18] p-6 shadow-2xl">
            {/* Confetti-style animation */}
            <div className="relative mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                <Check className="h-8 w-8 text-emerald-400" />
              </div>
            </div>

            <div className="text-center">
              <h4 className="text-lg font-semibold text-white">
                Vote Recorded!
              </h4>
              <p className="mt-1 text-sm text-gray-400">
                You gave{" "}
                <span className="text-amber-400 font-semibold">{weight} star{weight !== 1 ? "s" : ""}</span>{" "}
                to{" "}
                <span className="font-mono text-white">
                  {selectedSubmission &&
                    shortenAddress(selectedSubmission.creator)}
                </span>
              </p>
            </div>

            {/* Tx Hash */}
            <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
              <p className="mb-1 text-xs text-gray-500">Transaction Hash</p>
              <a
                href={`${explorerBaseUrl}/transaction/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 break-all font-mono text-xs text-cyan-400 hover:text-cyan-300"
              >
                {txHash.slice(0, 10)}...{txHash.slice(-8)}
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>

            <button
              onClick={handleReset}
              className="mt-5 w-full rounded-xl bg-white/[0.06] py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/[0.1] hover:text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
