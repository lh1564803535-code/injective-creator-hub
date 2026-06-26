"use client";

import { useCallback } from "react";
import {
  Megaphone,
  Vote,
  CheckCircle2,
  X,
  Bell,
} from "lucide-react";
import {
  NotificationContainer,
  useNotification,
  type NotificationVariant,
} from "@/components/ui/Notification";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CampaignNotificationType = "new_campaign" | "voting_started" | "settlement_complete";

export interface CampaignNotificationData {
  id: string;
  type: CampaignNotificationType;
  title: string;
  message: string;
  campaignId?: number;
  reward?: string;
  timestamp?: number;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const campaignNotificationConfig: Record<
  CampaignNotificationType,
  {
    icon: typeof Megaphone;
    variant: NotificationVariant;
    defaultTitle: string;
  }
> = {
  new_campaign: {
    icon: Megaphone,
    variant: "info",
    defaultTitle: "New Campaign Available",
  },
  voting_started: {
    icon: Vote,
    variant: "warning",
    defaultTitle: "Voting Has Started",
  },
  settlement_complete: {
    icon: CheckCircle2,
    variant: "success",
    defaultTitle: "Settlement Complete",
  },
};

// ---------------------------------------------------------------------------
// Notification card (dark card, inline)
// ---------------------------------------------------------------------------

export function CampaignNotificationCard({
  notification,
  onDismiss,
}: {
  notification: CampaignNotificationData;
  onDismiss?: (id: string) => void;
}) {
  const config = campaignNotificationConfig[notification.type];
  const Icon = config.icon;

  const variantStyles: Record<NotificationVariant, { border: string; iconBg: string; iconColor: string }> = {
    success: {
      border: "border-emerald-500/30",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
    },
    error: {
      border: "border-red-500/30",
      iconBg: "bg-red-500/15",
      iconColor: "text-red-400",
    },
    warning: {
      border: "border-amber-500/30",
      iconBg: "bg-amber-500/15",
      iconColor: "text-amber-400",
    },
    info: {
      border: "border-blue-500/30",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-400",
    },
  };

  const styles = variantStyles[config.variant];

  return (
    <div
      className={`
        flex items-start gap-3 rounded-xl border
        bg-gradient-to-r from-gray-900/95 to-gray-950/95
        backdrop-blur-xl shadow-lg shadow-black/30 p-4
        ${styles.border}
      `}
      role="status"
    >
      {/* Icon */}
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${styles.iconBg}`}>
        <Icon className={`h-4.5 w-4.5 ${styles.iconColor}`} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
          Campaign
        </p>
        <p className="mt-0.5 text-sm font-semibold text-white">
          {notification.title || config.defaultTitle}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-gray-400">
          {notification.message}
        </p>
        {notification.reward && (
          <p className="mt-1.5 text-sm font-semibold text-emerald-400">
            +{notification.reward} USDC
          </p>
        )}
        {notification.timestamp && (
          <p className="mt-1 text-[11px] text-gray-600">
            {new Date(notification.timestamp).toLocaleString()}
          </p>
        )}
      </div>

      {/* Dismiss */}
      {onDismiss && (
        <button
          onClick={() => onDismiss(notification.id)}
          className="shrink-0 rounded-md p-1 text-gray-600 transition-colors hover:bg-white/5 hover:text-gray-400"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Campaign notification list
// ---------------------------------------------------------------------------

export function CampaignNotificationList({
  notifications,
  onDismiss,
  className = "",
}: {
  notifications: CampaignNotificationData[];
  onDismiss?: (id: string) => void;
  className?: string;
}) {
  if (notifications.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {notifications.map((n) => (
        <CampaignNotificationCard
          key={n.id}
          notification={n}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hook: useCampaignNotification
// ---------------------------------------------------------------------------

export function useCampaignNotification() {
  const notification = useNotification();

  const notifyNewCampaign = useCallback(
    (campaignTitle: string, message?: string) =>
      notification.info(
        "New Campaign Available",
        message ?? `${campaignTitle} is now open for submissions.`,
      ),
    [notification],
  );

  const notifyVotingStarted = useCallback(
    (campaignTitle: string, message?: string) =>
      notification.warning(
        "Voting Has Started",
        message ?? `Voting is now open for ${campaignTitle}. Cast your votes!`,
      ),
    [notification],
  );

  const notifySettlementComplete = useCallback(
    (campaignTitle: string, reward?: string) => {
      const msg = reward
        ? `${campaignTitle} has been settled. Rewards of ${reward} USDC distributed.`
        : `${campaignTitle} has been settled successfully.`;
      return notification.success("Settlement Complete", msg);
    },
    [notification],
  );

  return {
    ...notification,
    notifyNewCampaign,
    notifyVotingStarted,
    notifySettlementComplete,
  };
}

// ---------------------------------------------------------------------------
// Self-contained wrapper with floating portal
// ---------------------------------------------------------------------------

export function CampaignNotification() {
  const { items, dismiss } = useCampaignNotification();

  return (
    <>
      <NotificationContainer items={items} onDismiss={dismiss} />
    </>
  );
}
