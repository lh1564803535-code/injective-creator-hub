"use client";

import { Megaphone } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CampaignAvatarProps {
  /** Campaign icon/image URL */
  icon?: string;
  /** Sponsor avatar URL */
  sponsorAvatar?: string;
  /** Campaign name (used for fallback initial) */
  name?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

// ---------------------------------------------------------------------------
// Size map
// ---------------------------------------------------------------------------

const sizeMap = {
  sm: {
    container: "h-10 w-10",
    icon: "h-5 w-5",
    sponsor: "h-4 w-4 -bottom-0.5 -right-0.5",
    text: "text-xs",
    ring: "ring-2",
  },
  md: {
    container: "h-14 w-14",
    icon: "h-6 w-6",
    sponsor: "h-5 w-5 -bottom-0.5 -right-0.5",
    text: "text-sm",
    ring: "ring-2",
  },
  lg: {
    container: "h-20 w-20",
    icon: "h-8 w-8",
    sponsor: "h-7 w-7 -bottom-1 -right-1",
    text: "text-lg",
    ring: "ring-3",
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CampaignAvatar({
  icon,
  sponsorAvatar,
  name,
  size = "md",
}: CampaignAvatarProps) {
  const s = sizeMap[size];

  return (
    <div className="relative inline-flex shrink-0">
      {/* Main campaign icon */}
      <div
        className={`flex items-center justify-center overflow-hidden rounded-full border-2 border-white/[0.12] bg-gradient-to-br from-indigo-600 to-purple-700 ${s.container} ${s.ring} ring-white/[0.06]`}
      >
        {icon ? (
          <img
            src={icon}
            alt={name || "Campaign"}
            className="h-full w-full object-cover"
          />
        ) : name ? (
          <span className={`font-bold text-white ${s.text}`}>
            {name.charAt(0).toUpperCase()}
          </span>
        ) : (
          <Megaphone className={`${s.icon} text-white/80`} />
        )}
      </div>

      {/* Sponsor avatar badge */}
      {sponsorAvatar && (
        <div
          className={`absolute flex items-center justify-center overflow-hidden rounded-full border-2 border-gray-900 bg-gray-800 ${s.sponsor}`}
        >
          <img
            src={sponsorAvatar}
            alt="Sponsor"
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
