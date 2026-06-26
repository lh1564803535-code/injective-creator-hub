"use client";

import { Megaphone, Plus } from "lucide-react";

interface CampaignEmptyStateProps {
  onCreateCampaign?: () => void;
}

export function CampaignEmptyState({ onCreateCampaign }: CampaignEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-[#0a0a0a] px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
        <Megaphone className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">No campaigns yet</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-500">
        There are no active campaigns at the moment. Be the first to create one and start earning rewards.
      </p>
      {onCreateCampaign && (
        <button
          onClick={onCreateCampaign}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Create campaign
        </button>
      )}
    </div>
  );
}
