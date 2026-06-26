"use client";

import { useMemo } from "react";
import { FileText, Send, Eye, Trophy, Clock, Award } from "lucide-react";
import { Kanban, type KanbanColumn, type KanbanCard } from "@/components/ui/Kanban";
import { formatUSDC } from "@/lib/injective";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CreatorWorkStage = "draft" | "submitted" | "review" | "awarded";

export interface CreatorWork {
  id: string;
  title: string;
  campaignTitle: string;
  stage: CreatorWorkStage;
  /** Submission date as unix timestamp (seconds) */
  submittedAt?: number;
  /** Vote count */
  votes?: number;
  /** Reward in USDC (bigint, 6 decimals) */
  reward?: bigint;
  /** Optional content URI */
  contentURI?: string;
}

interface CreatorKanbanProps {
  works: CreatorWork[];
  /** Optional callback when a work is moved between columns */
  onWorkMove?: (
    workId: string,
    fromStage: string,
    toStage: string,
  ) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Stage config
// ---------------------------------------------------------------------------

const STAGE_CONFIG: Record<
  CreatorWorkStage,
  { label: string; dotClassName: string; badgeClassName: string; icon: typeof FileText }
> = {
  draft: {
    label: "Draft",
    dotClassName: "bg-gray-500",
    badgeClassName: "bg-gray-500/10 text-gray-400",
    icon: FileText,
  },
  submitted: {
    label: "Submitted",
    dotClassName: "bg-blue-400",
    badgeClassName: "bg-blue-500/10 text-blue-400",
    icon: Send,
  },
  review: {
    label: "Review",
    dotClassName: "bg-amber-400",
    badgeClassName: "bg-amber-500/10 text-amber-400",
    icon: Eye,
  },
  awarded: {
    label: "Awarded",
    dotClassName: "bg-emerald-400",
    badgeClassName: "bg-emerald-500/10 text-emerald-400",
    icon: Trophy,
  },
};

const STAGES: CreatorWorkStage[] = ["draft", "submitted", "review", "awarded"];

// ---------------------------------------------------------------------------
// Work card meta
// ---------------------------------------------------------------------------

function WorkCardMeta({ work }: { work: CreatorWork }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-gray-500">{work.campaignTitle}</span>
      <div className="flex items-center gap-3 text-[11px] text-gray-500">
        {work.submittedAt && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(work.submittedAt * 1000).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
        {typeof work.votes === "number" && (
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {work.votes} votes
          </span>
        )}
        {work.reward !== undefined && work.reward > BigInt(0) && (
          <span className="flex items-center gap-1">
            <Award className="h-3 w-3" />
            {formatUSDC(work.reward)} USDC
          </span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CreatorKanban({
  works,
  onWorkMove,
  className = "",
}: CreatorKanbanProps) {
  const columns: KanbanColumn[] = useMemo(() => {
    const grouped: Record<CreatorWorkStage, KanbanCard[]> = {
      draft: [],
      submitted: [],
      review: [],
      awarded: [],
    };

    for (const work of works) {
      const stage = work.stage;
      const config = STAGE_CONFIG[stage];
      grouped[stage].push({
        id: work.id,
        title: work.title,
        badge: config.label,
        badgeClassName: config.badgeClassName,
        meta: <WorkCardMeta work={work} />,
        data: { work },
      });
    }

    return STAGES.map((stage) => {
      const config = STAGE_CONFIG[stage];
      return {
        id: stage,
        title: config.label,
        dotClassName: config.dotClassName,
        cards: grouped[stage],
      };
    });
  }, [works]);

  const handleCardMove = (cardId: string, from: string, to: string) => {
    onWorkMove?.(cardId, from, to);
  };

  return (
    <Kanban
      columns={columns}
      onCardMove={handleCardMove}
      className={className}
    />
  );
}
