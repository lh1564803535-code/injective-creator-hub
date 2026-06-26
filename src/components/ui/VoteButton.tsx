"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface VoteButtonProps {
  upvotes: number;
  downvotes: number;
  userVote?: "up" | "down" | null;
  onVote: (direction: "up" | "down") => void;
  disabled?: boolean;
  className?: string;
}

export function VoteButton({
  upvotes,
  downvotes,
  userVote,
  onVote,
  disabled = false,
  className = "",
}: VoteButtonProps) {
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (direction: "up" | "down") => {
    if (disabled || isVoting) return;
    setIsVoting(true);
    onVote(direction);
    setTimeout(() => setIsVoting(false), 500);
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={() => handleVote("up")}
        disabled={disabled || isVoting}
        className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs transition ${
          userVote === "up"
            ? "bg-emerald-500/15 text-emerald-400"
            : "bg-white/[0.04] text-gray-500 hover:bg-white/[0.08] hover:text-emerald-400"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <ThumbsUp className="h-3.5 w-3.5" />
        <span>{upvotes}</span>
      </button>
      <button
        onClick={() => handleVote("down")}
        disabled={disabled || isVoting}
        className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs transition ${
          userVote === "down"
            ? "bg-red-500/15 text-red-400"
            : "bg-white/[0.04] text-gray-500 hover:bg-white/[0.08] hover:text-red-400"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <ThumbsDown className="h-3.5 w-3.5" />
        <span>{downvotes}</span>
      </button>
    </div>
  );
}
