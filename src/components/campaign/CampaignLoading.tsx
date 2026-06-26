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
// Campaign list loading — full page skeleton for /campaigns
// ---------------------------------------------------------------------------

export function CampaignListLoading({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {/* Header + search bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Pulse className="h-7 w-48" />
          <Pulse className="h-4 w-72" />
        </div>
        <Pulse className="h-10 w-64 rounded-lg" />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
        {Array.from({ length: 5 }).map((_, i) => (
          <Pulse key={i} className="h-9 w-24 rounded-lg" />
        ))}
        <div className="flex-1" />
        <Pulse className="h-9 w-32 rounded-lg" />
      </div>

      {/* Campaign cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <CampaignCardLoading key={i} />
        ))}
      </div>

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
// Campaign card loading — single card skeleton
// ---------------------------------------------------------------------------

export function CampaignCardLoading() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      {/* Cover image */}
      <Pulse className="h-48 w-full rounded-none" />

      <div className="p-6 space-y-4">
        {/* Title + status badge */}
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <Pulse className="h-5 w-[70%]" />
            <Pulse className="h-3 w-[40%]" />
          </div>
          <Pulse className="h-6 w-16 rounded-full flex-shrink-0" />
        </div>

        {/* Description lines */}
        <div className="space-y-2">
          <Pulse className="h-3 w-full" />
          <Pulse className="h-3 w-[80%]" />
        </div>

        {/* Reward info */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
          <div className="flex items-center space-x-2">
            <Pulse className="h-5 w-5 rounded-full" />
            <Pulse className="h-4 w-20" />
          </div>
          <Pulse className="h-4 w-24" />
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Pulse className="h-3 w-16" />
            <Pulse className="h-3 w-12" />
          </div>
          <Pulse className="h-2 w-full rounded-full" />
        </div>

        {/* Participant avatars */}
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Pulse
                key={i}
                className="h-7 w-7 rounded-full border-2 border-background"
              />
            ))}
          </div>
          <Pulse className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Campaign detail loading — full detail page skeleton
// ---------------------------------------------------------------------------

export function CampaignDetailLoading() {
  return (
    <div className="space-y-8">
      {/* Hero banner */}
      <div className="relative">
        <Pulse className="h-64 w-full rounded-2xl" />

        {/* Overlay content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
          <Pulse className="h-8 w-[45%]" />
          <Pulse className="h-4 w-[30%]" />
          <div className="flex gap-3 pt-2">
            <Pulse className="h-6 w-20 rounded-full" />
            <Pulse className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Pulse className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Pulse className="h-4 w-32" />
            <Pulse className="h-3 w-20" />
          </div>
        </div>
        <div className="flex gap-3">
          <Pulse className="h-10 w-32 rounded-lg" />
          <Pulse className="h-10 w-10 rounded-lg" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-2"
          >
            <Pulse className="h-3 w-16" />
            <Pulse className="h-7 w-24" />
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
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <Pulse className="h-5 w-[30%]" />
          <Pulse className="h-4 w-full" />
          <Pulse className="h-4 w-[92%]" />
          <Pulse className="h-4 w-[97%]" />
          <Pulse className="h-4 w-[55%]" />

          <div className="pt-4 space-y-3">
            <Pulse className="h-5 w-[25%]" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]"
              >
                <Pulse className="h-10 w-10 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <Pulse className="h-4 w-[50%]" />
                  <Pulse className="h-3 w-[70%]" />
                </div>
                <Pulse className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
            <Pulse className="h-5 w-[40%]" />
            <Pulse className="h-8 w-full" />
            <Pulse className="h-4 w-[60%]" />
            <Pulse className="h-10 w-full rounded-lg" />
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
            <Pulse className="h-5 w-[50%]" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Pulse className="h-8 w-8 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <Pulse className="h-3 w-[60%]" />
                  <Pulse className="h-3 w-[40%]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
