"use client";

import { useState, useCallback } from "react";
import {
  Check,
  Trophy,
  Image,
  Users,
  Clock,
  Star,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SubmissionEntry {
  id: string;
  title: string;
  creator: string;
  imageUrl?: string;
  votes: number;
}

export interface CampaignPollProps {
  title: string;
  description?: string;
  submissions: SubmissionEntry[];
  totalVotes?: number;
  endsAt?: string;
  onVote?: (submissionId: string) => void;
  disabled?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Campaign Poll
// ---------------------------------------------------------------------------

export function CampaignPoll({
  title,
  description,
  submissions,
  totalVotes = 0,
  endsAt,
  onVote,
  disabled = false,
  className = "",
}: CampaignPollProps) {
  const [voted, setVoted] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const sorted = [...submissions].sort((a, b) => b.votes - a.votes);
  const maxVotes = sorted[0]?.votes ?? 1;

  const handleVote = useCallback(
    (id: string) => {
      if (voted || disabled) return;
      setVoted(id);
      onVote?.(id);
    },
    [voted, disabled, onVote],
  );

  return (
    <div
      className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 ${className}`}
    >
      {/* Header */}
      <div className="mb-1 flex items-center gap-2">
        <Trophy className="h-4 w-4 text-amber-400" />
        <span className="text-xs uppercase tracking-wider text-white/40">
          Campaign Vote
        </span>
      </div>
      <h3 className="mb-1 text-base font-medium text-white">{title}</h3>
      {description && (
        <p className="mb-4 text-sm text-white/40">{description}</p>
      )}

      {/* Meta row */}
      <div className="mb-4 flex items-center gap-4 text-xs text-white/30">
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {totalVotes.toLocaleString()} votes
        </span>
        {endsAt && (
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Ends {endsAt}
          </span>
        )}
      </div>

      {/* Submission list */}
      <div className="space-y-2">
        {sorted.map((sub, idx) => {
          const pct = totalVotes > 0 ? Math.round((sub.votes / totalVotes) * 100) : 0;
          const isVoted = voted === sub.id;
          const isLeading = idx === 0 && sub.votes > 0;

          return (
            <div
              key={sub.id}
              onMouseEnter={() => setHovered(sub.id)}
              onMouseLeave={() => setHovered(null)}
              className={`relative overflow-hidden rounded-lg border transition ${
                isVoted
                  ? "border-cyan-500/50 bg-cyan-500/10"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
              }`}
            >
              {/* Progress bar */}
              <div
                className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                  isLeading ? "bg-amber-500/10" : "bg-cyan-500/8"
                }`}
                style={{ width: `${(sub.votes / maxVotes) * 100}%` }}
              />

              <div className="relative z-10 flex items-center gap-3 px-4 py-3">
                {/* Rank badge */}
                <div
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    idx === 0 && sub.votes > 0
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-white/[0.06] text-white/40"
                  }`}
                >
                  {idx + 1}
                </div>

                {/* Thumbnail */}
                {sub.imageUrl ? (
                  <img
                    src={sub.imageUrl}
                    alt={sub.title}
                    className="h-10 w-10 rounded-lg object-cover ring-1 ring-white/[0.06]"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06]">
                    <Image className="h-4 w-4 text-white/20" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-medium text-white/80">
                      {sub.title}
                    </span>
                    {isLeading && (
                      <Star className="h-3.5 w-3.5 flex-shrink-0 fill-amber-400 text-amber-400" />
                    )}
                  </div>
                  <span className="text-xs text-white/30">{sub.creator}</span>
                </div>

                {/* Vote count + percent */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-white/70">
                      {sub.votes.toLocaleString()}
                    </div>
                    <div className="text-xs text-white/30">{pct}%</div>
                  </div>

                  {/* Vote button */}
                  {!voted ? (
                    <button
                      type="button"
                      onClick={() => handleVote(sub.id)}
                      disabled={disabled}
                      className="rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-cyan-400 disabled:opacity-40"
                    >
                      Vote
                    </button>
                  ) : isVoted ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
