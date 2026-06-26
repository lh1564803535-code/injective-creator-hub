"use client";

import { useState } from "react";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";

interface FollowButtonProps {
  isFollowing?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "px-2.5 py-1 text-[10px]",
  md: "px-3 py-1.5 text-xs",
  lg: "px-4 py-2 text-sm",
};

export function FollowButton({
  isFollowing = false,
  onFollow,
  onUnfollow,
  size = "md",
  className = "",
}: FollowButtonProps) {
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      if (following) {
        onUnfollow?.();
        setFollowing(false);
      } else {
        onFollow?.();
        setFollowing(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 rounded-full font-medium transition ${
        following
          ? "bg-white/[0.06] text-gray-400 hover:bg-red-500/10 hover:text-red-400"
          : "bg-cyan-500 text-white hover:bg-cyan-600"
      } ${sizeClasses[size]} ${loading ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : following ? (
        <UserMinus className="h-3.5 w-3.5" />
      ) : (
        <UserPlus className="h-3.5 w-3.5" />
      )}
      {following ? "Following" : "Follow"}
    </button>
  );
}
