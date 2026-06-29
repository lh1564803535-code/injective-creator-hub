"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  Bell,
  Trophy,
  Send,
  Zap,
  Clock,
  Check,
  CheckCheck,
  X,
  Filter,
} from "lucide-react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NotificationType = "reward" | "vote" | "deadline" | "settle";

export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  detail: string;
  timestamp: number;
  read: boolean;
  campaignId?: number;
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: number) => void;
  markAllRead: () => void;
  addNotification: (n: Omit<AppNotification, "id" | "read">) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within <NotificationProvider>"
    );
  return ctx;
}

// ---------------------------------------------------------------------------
// Mock data (shared across the app)
// ---------------------------------------------------------------------------

const now = Math.floor(Date.now() / 1000);

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 1,
    type: "reward",
    title: "Reward Available",
    detail: "You have 600 USDC unclaimed from Community Art Drop",
    timestamp: now - 3600,
    read: false,
    campaignId: 7,
  },
  {
    id: 2,
    type: "vote",
    title: "New Votes",
    detail:
      "Your submission in XHunt Content Sprint received 12 new votes",
    timestamp: now - 7200,
    read: false,
    campaignId: 1,
  },
  {
    id: 3,
    type: "deadline",
    title: "Deadline Approaching",
    detail: "DeFi Tutorial Challenge ends in 3 days",
    timestamp: now - 86400,
    read: true,
    campaignId: 2,
  },
  {
    id: 4,
    type: "settle",
    title: "Campaign Settled",
    detail:
      "DEX UI Redesign Sprint has been settled. Check your rewards!",
    timestamp: now - 86400 * 18,
    read: true,
    campaignId: 8,
  },
  {
    id: 5,
    type: "vote",
    title: "Vote Milestone",
    detail:
      "Your meme in Meme Contest #42 just crossed 200 votes!",
    timestamp: now - 10800,
    read: false,
    campaignId: 3,
  },
  {
    id: 6,
    type: "reward",
    title: "Reward Claimed",
    detail: "Successfully claimed 3000 USDC from DEX UI Redesign Sprint",
    timestamp: now - 86400 * 17,
    read: true,
    campaignId: 8,
  },
  {
    id: 7,
    type: "deadline",
    title: "Submission Window Closing",
    detail: "XHunt Content Sprint submission period ends in 2 days",
    timestamp: now - 14400,
    read: false,
    campaignId: 1,
  },
];

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

let notifIdCounter = INITIAL_NOTIFICATIONS.length;

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<AppNotification[]>(
    INITIAL_NOTIFICATIONS
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const markRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addNotification = useCallback(
    (n: Omit<AppNotification, "id" | "read">) => {
      setNotifications((prev) => [
        { ...n, id: ++notifIdCounter, read: false },
        ...prev,
      ]);
    },
    []
  );

  const ctx = useMemo<NotificationContextValue>(
    () => ({ notifications, unreadCount, markRead, markAllRead, addNotification }),
    [notifications, unreadCount, markRead, markAllRead, addNotification]
  );

  return (
    <NotificationContext.Provider value={ctx}>
      {children}
    </NotificationContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function timeAgo(timestamp: number): string {
  const diff = Math.floor(Date.now() / 1000) - timestamp;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const typeConfig: Record<
  NotificationType,
  { icon: typeof Trophy; label: string; color: string; bg: string }
> = {
  reward: {
    icon: Trophy,
    label: "Rewards",
    color: "text-[#F0B90B]",
    bg: "bg-[#F0B90B]/10",
  },
  vote: {
    icon: Send,
    label: "Votes",
    color: "text-[#00D4AA]",
    bg: "bg-[#00D4AA]/10",
  },
  deadline: {
    icon: Clock,
    label: "Deadlines",
    color: "text-[#F0B90B]",
    bg: "bg-[#F0B90B]/10",
  },
  settle: {
    icon: Zap,
    label: "Settlements",
    color: "text-[#00D4AA]",
    bg: "bg-[#00D4AA]/10",
  },
};

// ---------------------------------------------------------------------------
// Notification Bell Trigger
// ---------------------------------------------------------------------------

export function NotificationBell() {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[#848E9C] transition hover:bg-[#2B3139] hover:text-[#EAECEF]"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <Bell className="h-[18px] w-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F6465D] px-1 text-[10px] font-bold text-[#EAECEF] animate-notif-badge-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open &&
        createPortal(
          <NotificationPanel onClose={() => setOpen(false)} ref={panelRef} />,
          document.body
        )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Notification Panel (dropdown)
// ---------------------------------------------------------------------------

const NotificationPanel = ({
  onClose,
  ref,
}: {
  onClose: () => void;
  ref: React.RefObject<HTMLDivElement | null>;
}) => {
  const { notifications, markRead, markAllRead, unreadCount } =
    useNotifications();
  const [filter, setFilter] = useState<NotificationType | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? notifications
        : notifications.filter((n) => n.type === filter),
    [notifications, filter]
  );

  const filterOptions: Array<{ value: NotificationType | "all"; label: string }> = [
    { value: "all", label: "All" },
    { value: "reward", label: "Rewards" },
    { value: "vote", label: "Votes" },
    { value: "deadline", label: "Deadlines" },
    { value: "settle", label: "Settlements" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9998]" onClick={onClose} />

      {/* Panel */}
      <div
        ref={ref}
        className="animate-notif-panel-in fixed right-4 top-16 z-[9999] flex max-h-[min(520px,calc(100vh-80px))] w-[min(400px,calc(100vw-32px))] flex-col overflow-hidden rounded-xl border border-[#2B3139] bg-[#111118]/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2B3139] px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#00D4AA]" />
            <h3 className="text-sm font-semibold text-[#EAECEF]">Notifications</h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-[#00D4AA]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#00D4AA]">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex h-7 w-7 items-center justify-center rounded-lg transition ${
                showFilters
                  ? "bg-[#00D4AA]/15 text-[#00D4AA]"
                  : "text-[#848E9C] hover:bg-[#2B3139] hover:text-[#EAECEF]"
              }`}
              aria-label="Toggle filters"
            >
              <Filter className="h-3.5 w-3.5" />
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex h-7 items-center gap-1 rounded-lg px-2 text-[11px] text-[#848E9C] transition hover:bg-[#2B3139] hover:text-[#EAECEF]"
              >
                <CheckCheck className="h-3 w-3" />
                Read all
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#848E9C] transition hover:bg-[#2B3139] hover:text-[#EAECEF]"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex gap-1.5 border-b border-[#2B3139] px-4 py-2 animate-notif-filter-in">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                  filter === opt.value
                    ? "bg-[#00D4AA]/15 text-[#00D4AA]"
                    : "text-[#848E9C] hover:bg-[#2B3139] hover:text-[#EAECEF]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[#848E9C]">
              <Bell className="mb-2 h-8 w-8 text-[#848E9C]" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {filtered.map((notif, i) => {
                const config = typeConfig[notif.type];
                const Icon = config.icon;
                const content = (
                  <div
                    className={`animate-notif-item-in flex items-start gap-3 px-4 py-3 transition ${
                      notif.read
                        ? "bg-transparent"
                        : "bg-[#00D4AA]/[0.03] hover:bg-[#00D4AA]/[0.06]"
                    } hover:bg-[#1E2329]`}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {/* Icon */}
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bg} ${config.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={`truncate text-sm ${
                            notif.read
                              ? "font-normal text-[#848E9C]"
                              : "font-medium text-[#EAECEF]"
                          }`}
                        >
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-[#848E9C]">
                        {notif.detail}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] text-[#848E9C]">
                          {timeAgo(notif.timestamp)}
                        </span>
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${config.bg} ${config.color}`}
                        >
                          {config.label}
                        </span>
                      </div>
                    </div>

                    {/* Mark read button */}
                    {!notif.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markRead(notif.id);
                        }}
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[#848E9C] transition hover:bg-[#00D4AA]/10 hover:text-[#00D4AA]"
                        aria-label="Mark as read"
                      >
                        <Check className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                );

                if (notif.campaignId) {
                  return (
                    <Link
                      key={notif.id}
                      href={`/campaign/${notif.campaignId}`}
                      onClick={() => {
                        markRead(notif.id);
                        onClose();
                      }}
                      className="block"
                    >
                      {content}
                    </Link>
                  );
                }
                return (
                  <div key={notif.id} onClick={() => markRead(notif.id)}>
                    {content}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#2B3139] px-4 py-2.5">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 text-xs text-[#00D4AA] transition hover:text-[#00D4AA]"
          >
            View all in Dashboard
            <span className="text-[10px]">&rarr;</span>
          </Link>
        </div>
      </div>
    </>
  );
};
