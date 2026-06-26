"use client";

import { useMemo } from "react";
import { Clock, Users, Award } from "lucide-react";
import { Kanban, type KanbanColumn, type KanbanCard } from "@/components/ui/Kanban";
import { formatUSDC, getTimeRemaining, getCampaignStatus } from "@/lib/injective";
import type { Campaign } from "@/types/creator-settlement";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CampaignKanbanProps {
  campaigns: Campaign[];
  /** Optional callback when a campaign is moved between columns */
  onCampaignMove?: (
    campaignId: string,
    fromStatus: string,
    toStatus: string,
  ) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
  string,
  { label: string; dotClassName: string; badgeClassName: string }
> = {
  active: {
    label: "Active",
    dotClassName: "bg-emerald-400",
    badgeClassName: "bg-emerald-500/10 text-emerald-400",
  },
  voting: {
    label: "Voting",
    dotClassName: "bg-amber-400",
    badgeClassName: "bg-amber-500/10 text-amber-400",
  },
  ended: {
    label: "Ended",
    dotClassName: "bg-gray-500",
    badgeClassName: "bg-gray-500/10 text-gray-400",
  },
};

// ---------------------------------------------------------------------------
// Campaign card meta
// ---------------------------------------------------------------------------

function CampaignCardMeta({ campaign }: { campaign: Campaign }) {
  const timeRemaining = getTimeRemaining(campaign.deadline);
  return (
    <div className="flex items-center gap-3 text-[11px] text-gray-500">
      <span className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {timeRemaining}
      </span>
      <span className="flex items-center gap-1">
        <Users className="h-3 w-3" />
        {campaign.submissionCount}
      </span>
      <span className="flex items-center gap-1">
        <Award className="h-3 w-3" />
        {formatUSDC(campaign.totalReward)} USDC
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CampaignKanban({
  campaigns,
  onCampaignMove,
  className = "",
}: CampaignKanbanProps) {
  const columns: KanbanColumn[] = useMemo(() => {
    const grouped: Record<string, KanbanCard[]> = {
      active: [],
      voting: [],
      ended: [],
    };

    for (const campaign of campaigns) {
      const status = getCampaignStatus(campaign.deadline, campaign.settled);
      grouped[status].push({
        id: String(campaign.id),
        title: campaign.title,
        description: campaign.description,
        badge: STATUS_CONFIG[status].label,
        badgeClassName: STATUS_CONFIG[status].badgeClassName,
        meta: <CampaignCardMeta campaign={campaign} />,
        data: { campaign },
      });
    }

    return Object.entries(STATUS_CONFIG).map(([status, config]) => ({
      id: status,
      title: config.label,
      dotClassName: config.dotClassName,
      cards: grouped[status],
    }));
  }, [campaigns]);

  const handleCardMove = (cardId: string, from: string, to: string) => {
    onCampaignMove?.(cardId, from, to);
  };

  return (
    <Kanban
      columns={columns}
      onCardMove={handleCardMove}
      className={className}
    />
  );
}
