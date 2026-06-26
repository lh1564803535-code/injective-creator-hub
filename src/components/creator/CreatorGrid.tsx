"use client";

import { Users, Wallet } from "lucide-react";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { CreatorCard } from "./CreatorCard";
import type { Creator } from "@/types/creator-settlement";

// ---------------------------------------------------------------------------
// Creator Grid – responsive grid layout for creator cards
// ---------------------------------------------------------------------------

interface CreatorGridProps {
  creators: Creator[];
  isLoading?: boolean;
  emptyMessage?: string;
  onConnectWallet?: () => void;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-white/[0.06]" />
        <div className="flex-1">
          <div className="mb-2 h-4 w-24 rounded bg-white/[0.06]" />
          <div className="h-3 w-32 rounded bg-white/[0.04]" />
        </div>
      </div>
      <div className="mb-4 h-6 w-20 rounded-lg bg-white/[0.06]" />
      <div className="flex gap-3">
        <div className="h-8 w-20 rounded-lg bg-white/[0.04]" />
        <div className="h-8 w-20 rounded-lg bg-white/[0.04]" />
      </div>
    </div>
  );
}

function EmptyState({ message, onConnectWallet }: { message: string; onConnectWallet?: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
        <Users className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">No creators found</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500">{message}</p>
      {onConnectWallet && (
        <button
          onClick={onConnectWallet}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          <Wallet className="h-4 w-4" />
          Connect wallet
        </button>
      )}
    </div>
  );
}

export function CreatorGrid({
  creators,
  isLoading = false,
  emptyMessage = "The leaderboard is empty. Connect your wallet and start creating to appear on the rankings.",
  onConnectWallet,
}: CreatorGridProps) {
  if (isLoading) {
    return (
      <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </ResponsiveGrid>
    );
  }

  if (creators.length === 0) {
    return (
      <ResponsiveGrid cols={{ sm: 1 }} gap={6}>
        <EmptyState message={emptyMessage} onConnectWallet={onConnectWallet} />
      </ResponsiveGrid>
    );
  }

  return (
    <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap={6}>
      {creators.map((creator) => (
        <CreatorCard key={creator.address} creator={creator} />
      ))}
    </ResponsiveGrid>
  );
}
