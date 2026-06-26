"use client";

import { ExternalLink, Users, TrendingUp } from "lucide-react";

interface SocialPlatform {
  name: string;
  handle: string;
  url: string;
  followers?: number;
}

interface SocialProfileCardProps {
  address: string;
  ensName?: string;
  bio?: string;
  platforms?: SocialPlatform[];
  totalFollowers?: number;
  className?: string;
}

export function SocialProfileCard({
  address,
  ensName,
  bio,
  platforms = [],
  totalFollowers,
  className = "",
}: SocialProfileCardProps) {
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const displayName = ensName || shortAddress;

  return (
    <div className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 ${className}`}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-lg font-bold text-white">
          {displayName.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{displayName}</p>
          <p className="text-xs text-gray-500">{shortAddress}</p>
        </div>
        {totalFollowers !== undefined && (
          <div className="ml-auto flex items-center gap-1 text-xs text-gray-500">
            <Users className="h-3 w-3" />
            <span>{totalFollowers.toLocaleString()} followers</span>
          </div>
        )}
      </div>

      {bio && <p className="mb-4 text-sm text-gray-400">{bio}</p>}

      {platforms.length > 0 && (
        <div className="space-y-2">
          {platforms.map((platform, i) => (
            <a
              key={i}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2 transition hover:bg-white/[0.04]"
            >
              <div>
                <p className="text-xs font-medium text-white">{platform.name}</p>
                <p className="text-[10px] text-gray-500">{platform.handle}</p>
              </div>
              <div className="flex items-center gap-2">
                {platform.followers !== undefined && (
                  <span className="text-xs text-gray-500">{platform.followers.toLocaleString()}</span>
                )}
                <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
