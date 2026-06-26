"use client";

import { Avatar } from "./Avatar";

interface AvatarGroupProps {
  avatars: Array<{ src?: string; alt?: string; fallback?: string }>;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AvatarGroup({
  avatars,
  max = 4,
  size = "md",
  className = "",
}: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={`flex items-center -space-x-2 ${className}`}>
      {visible.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          alt={avatar.alt}
          fallback={avatar.fallback}
          size={size}
          className="ring-2 ring-[#1a1a1a]"
        />
      ))}
      {remaining > 0 && (
        <div
          className={`flex items-center justify-center rounded-full bg-white/[0.1] ring-2 ring-[#1a1a1a] ${
            size === "sm" ? "h-8 w-8 text-xs" : size === "lg" ? "h-12 w-12 text-base" : "h-10 w-10 text-sm"
          }`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
