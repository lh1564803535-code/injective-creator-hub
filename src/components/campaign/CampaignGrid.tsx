"use client";

import { Megaphone, Loader2 } from "lucide-react";
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";
import { CampaignCard } from "./CampaignCard";
import type { Campaign } from "@/types/creator-settlement";

// ---------------------------------------------------------------------------
// Campaign Grid – responsive grid layout for campaign cards
// ---------------------------------------------------------------------------

interface CampaignGridProps {
  campaigns: Campaign[];
  isLoading?: boolean;
  emptyMessage?: string;
  onCreateCampaign?: () => void;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
      <div className="mb-4 h-4 w-24 rounded bg-white/[0.06]" />
      <div className="mb-3 h-6 w-3/4 rounded bg-white/[0.06]" />
      <div className="mb-6 h-4 w-full rounded bg-white/[0.04]" />
      <div className="flex gap-3">
        <div className="h-8 w-20 rounded-lg bg-white/[0.04]" />
        <div className="h-8 w-20 rounded-lg bg-white/[0.04]" />
      </div>
    </div>
  );
}

function EmptyState({ message, onCreateCampaign }: { message: string; onCreateCampaign?: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
        <Megaphone className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">No campaigns found</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500">{message}</p>
      {onCreateCampaign && (
        <button
          onClick={onCreateCampaign}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          Create campaign
        </button>
      )}
    </div>
  );
}

export function CampaignGrid({
  campaigns,
  isLoading = false,
  emptyMessage = "There are no active campaigns at the moment. Be the first to create one.",
  onCreateCampaign,
}: CampaignGridProps) {
  if (isLoading) {
    return (
      <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }} gap={6}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </ResponsiveGrid>
    );
  }

  if (campaigns.length === 0) {
    return (
      <ResponsiveGrid cols={{ sm: 1 }} gap={6}>
        <EmptyState message={emptyMessage} onCreateCampaign={onCreateCampaign} />
      </ResponsiveGrid>
    );
  }

  return (
    <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 3 }} gap={6}>
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </ResponsiveGrid>
  );
}
