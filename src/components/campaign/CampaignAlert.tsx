"use client";

import { Clock, Vote, CheckCircle2 } from "lucide-react";
import { Alert, type AlertVariant } from "@/components/ui/Alert";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CampaignAlertItem {
  id: string;
  type: "deadline" | "voting" | "settled";
  title: string;
  message: string;
  campaignId?: number;
  timestamp?: number;
}

interface CampaignAlertProps {
  alerts: CampaignAlertItem[];
  onDismiss?: (id: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const alertTypeConfig: Record<
  CampaignAlertItem["type"],
  { icon: typeof Clock; variant: AlertVariant; label: string }
> = {
  deadline: {
    icon: Clock,
    variant: "warning",
    label: "Deadline Approaching",
  },
  voting: {
    icon: Vote,
    variant: "info",
    label: "Voting Started",
  },
  settled: {
    icon: CheckCircle2,
    variant: "success",
    label: "Settlement Complete",
  },
};

// ---------------------------------------------------------------------------
// CampaignAlert
// ---------------------------------------------------------------------------

export function CampaignAlert({
  alerts,
  onDismiss,
  className = "",
}: CampaignAlertProps) {
  if (alerts.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {alerts.map((alert) => {
        const config = alertTypeConfig[alert.type];
        const Icon = config.icon;

        return (
          <Alert
            key={alert.id}
            variant={config.variant}
            title={
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {alert.title || config.label}
              </span>
            }
            closable={!!onDismiss}
            onClose={() => onDismiss?.(alert.id)}
          >
            <p>{alert.message}</p>
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

export function CampaignDeadlineAlert({
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
        Submit your content before it&apos;s too late!
      </p>
    </Alert>
  );
}

export function CampaignVotingAlert({
  campaignTitle,
  onDismiss,
  className,
}: {
  campaignTitle: string;
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <Alert
      variant="info"
      title="Voting Has Started"
      closable={!!onDismiss}
      onClose={onDismiss}
      className={className}
    >
      <p>
        Voting is now open for{" "}
        <span className="font-medium text-white">{campaignTitle}</span>.
        Support your favorite creators by casting your votes!
      </p>
    </Alert>
  );
}

export function CampaignSettledAlert({
  campaignTitle,
  reward,
  onDismiss,
  className,
}: {
  campaignTitle: string;
  reward?: string;
  onDismiss?: () => void;
  className?: string;
}) {
  return (
    <Alert
      variant="success"
      title="Settlement Complete"
      closable={!!onDismiss}
      onClose={onDismiss}
      className={className}
    >
      <p>
        <span className="font-medium text-white">{campaignTitle}</span> has
        been settled.
        {reward && (
          <>
            {" "}
            Rewards of{" "}
            <span className="font-semibold text-emerald-400">{reward} USDC</span>{" "}
            have been distributed.
          </>
        )}
      </p>
    </Alert>
  );
}
