"use client";

import { Gift, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { Alert, type AlertVariant } from "@/components/ui/Alert";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CreatorAlertItem {
  id: string;
  type: "reward" | "deadline" | "rank_change";
  title: string;
  message: string;
  amount?: string;
  previousRank?: number;
  currentRank?: number;
  timestamp?: number;
}

interface CreatorAlertProps {
  alerts: CreatorAlertItem[];
  onDismiss?: (id: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const alertTypeConfig: Record<
  CreatorAlertItem["type"],
  { icon: typeof Gift; variant: AlertVariant; label: string }
> = {
  reward: {
    icon: Gift,
    variant: "success",
    label: "New Reward Received",
  },
  deadline: {
    icon: Clock,
    variant: "warning",
    label: "Campaign Deadline Approaching",
  },
  rank_change: {
    icon: TrendingUp,
    variant: "info",
    label: "Rank Changed",
  },
};

// ---------------------------------------------------------------------------
// CreatorAlert
// ---------------------------------------------------------------------------

export function CreatorAlert({
  alerts,
  onDismiss,
  className = "",
}: CreatorAlertProps) {
  if (alerts.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {alerts.map((alert) => {
        const config = alertTypeConfig[alert.type];
        const Icon = config.icon;

        // Use warning variant for rank drops
        const effectiveVariant =
          alert.type === "rank_change" &&
          alert.previousRank &&
          alert.currentRank &&
          alert.currentRank > alert.previousRank
            ? "warning"
            : config.variant;

        const RankIcon =
          alert.type === "rank_change" &&
          alert.previousRank &&
          alert.currentRank &&
          alert.currentRank > alert.previousRank
            ? TrendingDown
            : Icon;

        return (
          <Alert
            key={alert.id}
            variant={effectiveVariant}
            title={
              <span className="flex items-center gap-2">
                <RankIcon className="h-4 w-4" />
                {alert.title || config.label}
              </span>
            }
            closable={!!onDismiss}
            onClose={() => onDismiss?.(alert.id)}
          >
            <p>{alert.message}</p>
            {alert.type === "reward" && alert.amount && (
              <p className="mt-1 font-semibold text-emerald-400">
                +{alert.amount} USDC
              </p>
            )}
            {alert.type === "rank_change" &&
              alert.previousRank &&
              alert.currentRank && (
                <p className="mt-1 text-xs">
                  <span className="text-gray-500">Rank: </span>
                  <span className="text-gray-400 line-through">
                    #{alert.previousRank}
                  </span>
                  <span className="mx-1 text-gray-600">&rarr;</span>
                  <span className="font-semibold text-white">
                    #{alert.currentRank}
                  </span>
                </p>
              )}
            {alert.timestamp && (
              <p className="mt-1 text-xs text-gray-500">
                {new Date(alert.timestamp).toLocaleString()}
              </p>
            )}
          </Alert>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single convenience components
// ---------------------------------------------------------------------------

export function CreatorRewardAlert({
  amount,
  campaignTitle,
  onDismiss,
  className,
}: {
  amount: string;
  campaignTitle?: string;
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <Alert
      variant="success"
      title="New Reward Received"
      closable={!!onDismiss}
      onClose={onDismiss}
      className={className}
    >
      <p>
        You&apos;ve received{" "}
        <span className="font-semibold text-emerald-400">{amount} USDC</span>
        {campaignTitle && (
          <>
            {" "}
            from <span className="font-medium text-white">{campaignTitle}</span>
          </>
        )}
        . Keep up the great work!
      </p>
    </Alert>
  );
}

export function CreatorDeadlineAlert({
  campaignTitle,
  hoursLeft,
  onDismiss,
  className,
}: {
  campaignTitle: string;
  hoursLeft: number;
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <Alert
      variant="warning"
      title="Campaign Deadline Approaching"
      closable={!!onDismiss}
      onClose={onDismiss}
      className={className}
    >
      <p>
        <span className="font-medium text-white">{campaignTitle}</span> ends in{" "}
        <span className="font-semibold text-amber-400">{hoursLeft}h</span>.
        Make sure to submit before the deadline!
      </p>
    </Alert>
  );
}

export function CreatorRankChangeAlert({
  previousRank,
  currentRank,
  campaignTitle,
  onDismiss,
  className,
}: {
  previousRank: number;
  currentRank: number;
  campaignTitle?: string;
  onDismiss?: () => void;
  className?: string;
}) {
  const improved = currentRank < previousRank;

  return (
    <Alert
      variant={improved ? "success" : "warning"}
      title={improved ? "Rank Improved!" : "Rank Dropped"}
      closable={!!onDismiss}
      onClose={onDismiss}
      className={className}
    >
      <p>
        {campaignTitle && (
          <>
            In <span className="font-medium text-white">{campaignTitle}</span>,{" "}
          </>
        )}
        your rank changed from{" "}
        <span className="text-gray-400 line-through">#{previousRank}</span> to{" "}
        <span className="font-semibold text-white">#{currentRank}</span>.
        {improved ? " Keep it up!" : " Keep pushing!"}
      </p>
    </Alert>
  );
}
