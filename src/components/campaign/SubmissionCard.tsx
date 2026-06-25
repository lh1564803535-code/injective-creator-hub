"use client";

import { useState } from "react";
import { ThumbsUp, ExternalLink, Check } from "lucide-react";
import { shortenAddress } from "@/lib/injective";
import type { Submission } from "@/types/creator-settlement";

interface SubmissionCardProps {
  submission: Submission;
  rank?: number;
  onVote?: (submissionId: number, weight: number) => void;
  isVoting?: boolean;
}

export function SubmissionCard({
  submission,
  rank,
  onVote,
  isVoting = false,
}: SubmissionCardProps) {
  const [selectedWeight, setSelectedWeight] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    if (selectedWeight && onVote && !hasVoted) {
      onVote(submission.id, selectedWeight);
      setHasVoted(true);
    }
  };

  const rankStyles = {
    1: "from-amber-500/20 to-amber-600/10 border-amber-500/30",
    2: "from-gray-400/20 to-gray-500/10 border-gray-400/30",
    3: "from-orange-600/20 to-orange-700/10 border-orange-600/30",
  };

  const rankBadgeStyles = {
    1: "bg-amber-500 text-white",
    2: "bg-gray-400 text-white",
    3: "bg-orange-600 text-white",
  };

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-5 transition-all ${
        rank && rank <= 3
          ? rankStyles[rank as keyof typeof rankStyles]
          : "border-white/[0.06] from-[#13131b] to-[#1a1a25]"
      }`}
    >
      {/* Rank Badge */}
      {rank && (
        <div className="mb-3 flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              rankBadgeStyles[rank as keyof typeof rankBadgeStyles] ||
              "bg-white/10 text-gray-400"
            }`}
          >
            {rank}
          </span>
          <span className="text-sm text-gray-400">#{rank}</span>
        </div>
      )}

      {/* Content Preview */}
      <div className="mb-4">
        <a
          href={submission.contentURI}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
        >
          <ExternalLink className="h-4 w-4" />
          <span className="truncate">View Content</span>
        </a>
      </div>

      {/* Creator */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white">
          {submission.creator.slice(2, 4).toUpperCase()}
        </div>
        <span className="font-mono text-sm text-gray-300">
          {shortenAddress(submission.creator)}
        </span>
      </div>

      {/* Votes */}
      <div className="mb-4 flex items-center gap-2">
        <ThumbsUp className="h-4 w-4 text-amber-400" />
        <span className="text-lg font-semibold text-white">
          {submission.votes}
        </span>
        <span className="text-sm text-gray-400">votes</span>
      </div>

      {/* Vote Controls */}
      {onVote && !hasVoted && !submission.claimed && (
        <div className="space-y-3">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((weight) => (
              <button
                key={weight}
                onClick={() => setSelectedWeight(weight)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition ${
                  selectedWeight === weight
                    ? "bg-cyan-500 text-white"
                    : "bg-white/[0.06] text-gray-400 hover:bg-white/[0.1]"
                }`}
              >
                {weight}
              </button>
            ))}
          </div>
          <button
            onClick={handleVote}
            disabled={!selectedWeight || isVoting}
            className="w-full rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVoting ? "Voting..." : "Vote"}
          </button>
        </div>
      )}

      {/* Voted State */}
      {hasVoted && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
          <Check className="h-4 w-4" />
          Voted successfully
        </div>
      )}
    </div>
  );
}
