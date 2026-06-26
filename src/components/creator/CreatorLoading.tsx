"use client";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Internal skeleton primitive
// ---------------------------------------------------------------------------

function Pulse({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded-md bg-white/[0.06] animate-pulse", className)}
    />
  );
}

// ---------------------------------------------------------------------------
// Leaderboard loading — full page skeleton for /creators leaderboard
// ---------------------------------------------------------------------------

export function LeaderboardLoading({ count = 10 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Pulse className="h-7 w-52" />
          <Pulse className="h-4 w-80" />
        </div>
        <div className="flex gap-3">
          <Pulse className="h-10 w-40 rounded-lg" />
          <Pulse className="h-10 w-10 rounded-lg" />
        </div>
      </div>

      {/* Stats summary bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-2"
          >
            <Pulse className="h-3 w-16" />
            <Pulse className="h-6 w-20" />
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
        {Array.from({ length: 3 }).map((_, i) => (
          <Pulse key={i} className="h-9 w-28 rounded-lg" />
        ))}
        <div className="flex-1" />
        <Pulse className="h-9 w-36 rounded-lg" />
      </div>

      {/* Table header */}
      <div className="flex items-center p-4 rounded-xl bg-white/[0.02]">
        <Pulse className="h-4 w-12" />
        <div className="flex-1 ml-16">
          <Pulse className="h-4 w-24" />
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Pulse className="h-4 w-16" />
          <Pulse className="h-4 w-16" />
          <Pulse className="h-4 w-12" />
        </div>
        <Pulse className="h-4 w-16 ml-4" />
      </div>

      {/* Leaderboard rows */}
      {Array.from({ length: count }).map((_, i) => (
        <LeaderboardRowLoading key={i} rank={i + 1} />
      ))}

      {/* Pagination */}
      <div className="flex justify-center gap-2 pt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Pulse key={i} className="h-9 w-9 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Leaderboard row loading — single row skeleton
// ---------------------------------------------------------------------------

export function LeaderboardRowLoading({ rank }: { rank?: number }) {
  const isTopThree = rank !== undefined && rank <= 3;

  return (
    <div
      className={cn(
        "flex items-center p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]",
        isTopThree && "border-cyan-500/20 bg-cyan-500/[0.02]"
      )}
    >
      {/* Rank badge */}
      <div className="w-12 flex-shrink-0">
        <Pulse className="h-6 w-8 mx-auto rounded-lg" />
      </div>

      {/* Creator info */}
      <div className="flex items-center space-x-3 flex-1 ml-4">
        <Pulse className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="space-y-1">
          <Pulse className="h-4 w-28" />
          <Pulse className="h-3 w-16" />
        </div>
      </div>

      {/* Stats columns */}
      <div className="hidden md:flex items-center space-x-8">
        <div className="text-right space-y-1">
          <Pulse className="h-4 w-20" />
          <Pulse className="h-3 w-12" />
        </div>
        <div className="text-right space-y-1">
          <Pulse className="h-4 w-16" />
          <Pulse className="h-3 w-10" />
        </div>
        <div className="text-right space-y-1">
          <Pulse className="h-4 w-12" />
          <Pulse className="h-3 w-8" />
        </div>
      </div>

      {/* Score / action */}
      <div className="ml-4 flex-shrink-0">
        <Pulse className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Creator detail loading — full profile page skeleton
// ---------------------------------------------------------------------------

export function CreatorDetailLoading() {
  return (
    <div className="space-y-8">
      {/* Cover + avatar */}
      <div className="relative">
        <Pulse className="h-48 w-full rounded-2xl" />
        <div className="absolute -bottom-12 left-6">
          <Pulse className="h-24 w-24 rounded-full border-4 border-background" />
        </div>
      </div>

      {/* Profile info */}
      <div className="pt-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Pulse className="h-7 w-44" />
          <Pulse className="h-4 w-28" />
          <Pulse className="h-4 w-72" />
        </div>
        <div className="flex gap-2">
          <Pulse className="h-10 w-28 rounded-lg" />
          <Pulse className="h-10 w-10 rounded-lg" />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Pulse key={i} className="h-6 w-16 rounded-full" />
        ))}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-2"
          >
            <Pulse className="h-3 w-16" />
            <Pulse className="h-6 w-20" />
            <Pulse className="h-3 w-12" />
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex gap-4 border-b border-white/[0.06] pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Pulse key={i} className="h-8 w-20" />
        ))}
      </div>

      {/* Two-column content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-2 space-y-6">
          {/* About section */}
          <div className="space-y-3">
            <Pulse className="h-5 w-[20%]" />
            <Pulse className="h-4 w-full" />
            <Pulse className="h-4 w-[88%]" />
            <Pulse className="h-4 w-[65%]" />
          </div>

          {/* Recent campaigns */}
          <div className="space-y-4">
            <Pulse className="h-5 w-[30%]" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
                >
                  <Pulse className="h-32 w-full rounded-none" />
                  <div className="p-4 space-y-2">
                    <Pulse className="h-4 w-[70%]" />
                    <Pulse className="h-3 w-full" />
                    <div className="flex justify-between pt-2">
                      <Pulse className="h-4 w-16" />
                      <Pulse className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings history */}
          <div className="space-y-3">
            <Pulse className="h-5 w-[25%]" />
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              {/* Chart area */}
              <Pulse className="h-48 w-full rounded-lg" />
              {/* Legend */}
              <div className="flex gap-4 mt-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Pulse className="h-3 w-3 rounded-full" />
                    <Pulse className="h-3 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Social links */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
            <Pulse className="h-5 w-[35%]" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Pulse className="h-8 w-8 rounded-lg flex-shrink-0" />
                <Pulse className="h-4 w-24" />
              </div>
            ))}
          </div>

          {/* Achievement badges */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
            <Pulse className="h-5 w-[40%]" />
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="text-center space-y-1">
                  <Pulse className="h-10 w-10 rounded-full mx-auto" />
                  <Pulse className="h-3 w-12 mx-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* Activity feed */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
            <Pulse className="h-5 w-[30%]" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Pulse className="h-6 w-6 rounded-full flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <Pulse className="h-3 w-[80%]" />
                  <Pulse className="h-3 w-[50%]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
