"use client";

import { useState, useEffect, useRef } from "react";
import {
  Eye,
  Share2,
  Heart,
  TrendingUp,
  ExternalLink,
  BadgeCheck,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SocialMetrics {
  views: number;
  shares: number;
  reactions: number;
  trendingScore: number; // 0-100
  farcasterFid?: number;
  lensHandle?: string;
  ensName?: string;
}

interface SocialProofProps {
  metrics: SocialMetrics;
  variant?: "compact" | "full";
  showBadges?: boolean;
}

// ---------------------------------------------------------------------------
// Animated counter hook
// ---------------------------------------------------------------------------

function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    function update(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(target * eased));
      if (progress < 1) requestAnimationFrame(update);
      else setValue(target);
    }
    requestAnimationFrame(update);
  }, [target, duration]);

  return value;
}

// ---------------------------------------------------------------------------
// Trending badge
// ---------------------------------------------------------------------------

function TrendingBadge({ score }: { score: number }) {
  if (score < 60) return null;

  const tier = score >= 90 ? "hot" : score >= 75 ? "rising" : "warm";
  const config = {
    hot: {
      label: "Hot",
      bg: "bg-orange-500/15",
      text: "text-orange-400",
      border: "border-orange-500/30",
      glow: "shadow-orange-500/20",
    },
    rising: {
      label: "Rising",
      bg: "bg-cyan-500/15",
      text: "text-cyan-400",
      border: "border-cyan-500/30",
      glow: "shadow-cyan-500/20",
    },
    warm: {
      label: "Warm",
      bg: "bg-amber-500/15",
      text: "text-amber-400",
      border: "border-amber-500/30",
      glow: "shadow-amber-500/20",
    },
  };

  const c = config[tier];

  return (
    <span
      className={`trending-badge inline-flex items-center gap-1 rounded-full border ${c.border} ${c.bg} ${c.text} px-2 py-0.5 text-[10px] font-semibold shadow-sm ${c.glow}`}
    >
      <TrendingUp className="h-2.5 w-2.5" />
      {c.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Social verification badges
// ---------------------------------------------------------------------------

interface SocialBadgeProps {
  platform: "farcaster" | "lens" | "ens";
  identifier: string;
  href?: string;
}

function SocialBadge({ platform, identifier, href }: SocialBadgeProps) {
  const config = {
    farcaster: {
      label: "Farcaster",
      icon: "🟣",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    lens: {
      label: "Lens",
      icon: "🌿",
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    ens: {
      label: "ENS",
      icon: "🔗",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
  };

  const c = config[platform];
  const content = (
    <span
      className={`social-badge inline-flex items-center gap-1.5 rounded-full border ${c.border} ${c.bg} px-2.5 py-1 text-[11px] font-medium ${c.color} transition-all hover:scale-105 hover:shadow-sm`}
    >
      <BadgeCheck className="h-3 w-3" />
      <span>{identifier}</span>
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex"
      >
        {content}
      </a>
    );
  }

  return content;
}

// ---------------------------------------------------------------------------
// Metric item
// ---------------------------------------------------------------------------

function MetricItem({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  color: string;
}) {
  const animatedValue = useCountUp(value);

  const formatValue = (v: number) => {
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
    return v.toLocaleString();
  };

  return (
    <div className="flex items-center gap-1.5">
      <Icon className={`h-3.5 w-3.5 ${color}`} />
      <span className="text-xs font-semibold text-white">
        {formatValue(animatedValue)}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main SocialProof component
// ---------------------------------------------------------------------------

export function SocialProof({
  metrics,
  variant = "compact",
  showBadges = false,
}: SocialProofProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  if (variant === "compact") {
    return (
      <div
        ref={ref}
        className={`flex items-center gap-3 ${isVisible ? "social-proof-in" : "opacity-0"}`}
      >
        <MetricItem
          icon={Eye}
          value={metrics.views}
          label="views"
          color="text-gray-400"
        />
        <MetricItem
          icon={Heart}
          value={metrics.reactions}
          label="reactions"
          color="text-rose-400"
        />
        <MetricItem
          icon={Share2}
          value={metrics.shares}
          label="shares"
          color="text-cyan-400"
        />
        <TrendingBadge score={metrics.trendingScore} />
      </div>
    );
  }

  // Full variant
  return (
    <div
      ref={ref}
      className={`social-proof-full ${isVisible ? "social-proof-in" : "opacity-0"}`}
    >
      {/* Engagement metrics */}
      <div className="mb-3 flex items-center gap-4">
        <MetricItem
          icon={Eye}
          value={metrics.views}
          label="views"
          color="text-gray-400"
        />
        <MetricItem
          icon={Heart}
          value={metrics.reactions}
          label="reactions"
          color="text-rose-400"
        />
        <MetricItem
          icon={Share2}
          value={metrics.shares}
          label="shares"
          color="text-cyan-400"
        />
      </div>

      {/* Trending score bar */}
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[11px] text-gray-500">Engagement Score</span>
          <TrendingBadge score={metrics.trendingScore} />
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="trending-bar h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-1000 ease-out"
            style={{ width: isVisible ? `${metrics.trendingScore}%` : "0%" }}
          />
        </div>
      </div>

      {/* Social badges */}
      {showBadges && (
        <div className="flex flex-wrap gap-2">
          {metrics.farcasterFid && (
            <SocialBadge
              platform="farcaster"
              identifier={`FID ${metrics.farcasterFid}`}
              href={`https://warpcast.com/~/profiles/${metrics.farcasterFid}`}
            />
          )}
          {metrics.lensHandle && (
            <SocialBadge
              platform="lens"
              identifier={metrics.lensHandle}
              href={`https://hey.xyz/u/${metrics.lensHandle}`}
            />
          )}
          {metrics.ensName && (
            <SocialBadge
              platform="ens"
              identifier={metrics.ensName}
              href={`https://app.ens.domains/name/${metrics.ensName}`}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Standalone creator social badges (for profiles)
// ---------------------------------------------------------------------------

export function CreatorSocialBadges({
  farcasterFid,
  lensHandle,
  ensName,
}: {
  farcasterFid?: number;
  lensHandle?: string;
  ensName?: string;
}) {
  const badges = [];
  if (farcasterFid)
    badges.push(
      <SocialBadge
        key="fc"
        platform="farcaster"
        identifier={`FID ${farcasterFid}`}
        href={`https://warpcast.com/~/profiles/${farcasterFid}`}
      />
    );
  if (lensHandle)
    badges.push(
      <SocialBadge
        key="lens"
        platform="lens"
        identifier={lensHandle}
        href={`https://hey.xyz/u/${lensHandle}`}
      />
    );
  if (ensName)
    badges.push(
      <SocialBadge
        key="ens"
        platform="ens"
        identifier={ensName}
        href={`https://app.ens.domains/name/${ensName}`}
      />
    );

  if (badges.length === 0) return null;

  return <div className="flex flex-wrap gap-2">{badges}</div>;
}
