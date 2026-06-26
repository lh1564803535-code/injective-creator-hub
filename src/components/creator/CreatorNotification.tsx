"use client";

import { useCallback } from "react";
import {
  Gift,
  TrendingUp,
  TrendingDown,
  Clock,
  X,
} from "lucide-react";
import {
  NotificationContainer,
  useNotification,
  type NotificationVariant,
} from "@/components/ui/Notification";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CreatorNotificationType = "new_reward" | "rank_change" | "campaign_deadline";

export interface CreatorNotificationData {
  id: string;
  type: CreatorNotificationType;
  title: string;
  message: string;
  amount?: string;
  previousRank?: number;
  currentRank?: number;
  hoursLeft?: number;
  timestamp?: number;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const creatorNotificationConfig: Record<
  CreatorNotificationType,
  {
    icon: typeof Gift;
    variant: NotificationVariant;
    defaultTitle: string;
  }
> = {
  new_reward: {
    icon: Gift,
    variant: "success",
    defaultTitle: "New Reward Received",
  },
  rank_change: {
    icon: TrendingUp,
    variant: "info",
    defaultTitle: "Rank Changed",
  },
  campaign_deadline: {
    icon: Clock,
    variant: "warning",
    defaultTitle: "Campaign Deadline Approaching",
  },
};

// ---------------------------------------------------------------------------
// Notification card (dark card, inline)
// ---------------------------------------------------------------------------

export function CreatorNotificationCard({
  notification,
  onDismiss,
}: {
  notification: CreatorNotificationData;
  onDismiss?: (id: string) => void;
}) {
  const config = creatorNotificationConfig[notification.type];

  // Determine effective variant for rank changes
  const isRankDrop =
    notification.type === "rank_change" &&
    notification.previousRank !== undefined &&
    notification.currentRank !== undefined &&
    notification.currentRank > notification.previousRank;

  const effectiveVariant = isRankDrop ? "warning" : config.variant;

  // Pick icon (TrendingDown for rank drops)
  const Icon =
    isRankDrop ? TrendingDown : config.icon;

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

  const styles = variantStyles[effectiveVariant];

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
          Creator
        </p>
        <p className="mt-0.5 text-sm font-semibold text-white">
          {notification.title || config.defaultTitle}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-gray-400">
          {notification.message}
        </p>

        {/* Reward amount */}
        {notification.type === "new_reward" && notification.amount && (
          <p className="mt-1.5 text-sm font-semibold text-emerald-400">
            +{notification.amount} USDC
          </p>
        )}

        {/* Rank change detail */}
        {notification.type === "rank_change" &&
          notification.previousRank !== undefined &&
          notification.currentRank !== undefined && (
            <p className="mt-1.5 text-xs">
              <span className="text-gray-500">Rank: </span>
              <span className="text-gray-400 line-through">
                #{notification.previousRank}
              </span>
              <span className="mx-1 text-gray-600">&rarr;</span>
              <span className="font-semibold text-white">
                #{notification.currentRank}
              </span>
            </p>
          )}

        {/* Deadline hours */}
        {notification.type === "campaign_deadline" && notification.hoursLeft !== undefined && (
          <p className="mt-1.5 text-xs">
            <span className="font-semibold text-amber-400">
              {notification.hoursLeft}h
            </span>
            <span className="text-gray-500"> remaining</span>
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
// Creator notification list
// ---------------------------------------------------------------------------

export function CreatorNotificationList({
  notifications,
  onDismiss,
  className = "",
}: {
  notifications: CreatorNotificationData[];
  onDismiss?: (id: string) => void;
  className?: string;
}) {
  if (notifications.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {notifications.map((n) => (
        <CreatorNotificationCard
          key={n.id}
          notification={n}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hook: useCreatorNotification
// ---------------------------------------------------------------------------

export function useCreatorNotification() {
  const notification = useNotification();

  const notifyNewReward = useCallback(
    (amount: string, campaignTitle?: string) => {
      const msg = campaignTitle
        ? `You received ${amount} USDC from ${campaignTitle}.`
        : `You received ${amount} USDC. Keep up the great work!`;
      return notification.success("New Reward Received", msg);
    },
    [notification],
  );

  const notifyRankChange = useCallback(
    (previousRank: number, currentRank: number, campaignTitle?: string) => {
      const improved = currentRank < previousRank;
      const prefix = campaignTitle ? `In ${campaignTitle}, y` : "Y";
      const msg = improved
        ? `${prefix}our rank improved from #${previousRank} to #${currentRank}!`
        : `${prefix}our rank changed from #${previousRank} to #${currentRank}. Keep pushing!`;
      return notification[improved ? "success" : "warning"](
        improved ? "Rank Improved!" : "Rank Changed",
        msg,
      );
    },
    [notification],
  );

  const notifyCampaignDeadline = useCallback(
    (campaignTitle: string, hoursLeft: number) =>
      notification.warning(
        "Campaign Deadline Approaching",
        `${campaignTitle} ends in ${hoursLeft}h. Submit before it's too late!`,
      ),
    [notification],
  );

  return {
    ...notification,
    notifyNewReward,
    notifyRankChange,
    notifyCampaignDeadline,
  };
}

// ---------------------------------------------------------------------------
// Self-contained wrapper with floating portal
// ---------------------------------------------------------------------------

export function CreatorNotification() {
  const { items, dismiss } = useCreatorNotification();

  return (
    <>
      <NotificationContainer items={items} onDismiss={dismiss} />
    </>
  );
}
