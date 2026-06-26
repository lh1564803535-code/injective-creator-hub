"use client";

import { CheckCircle, Circle, Clock } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TimelineItemStatus = "completed" | "in-progress" | "upcoming";

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  status: TimelineItemStatus;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const statusConfig: Record<
  TimelineItemStatus,
  {
    icon: typeof CheckCircle;
    color: string;
    bg: string;
    line: string;
    label: string;
  }
> = {
  completed: {
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    line: "bg-emerald-500",
    label: "Completed",
  },
  "in-progress": {
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    line: "bg-amber-500",
    label: "In Progress",
  },
  upcoming: {
    icon: Circle,
    color: "text-gray-500",
    bg: "bg-gray-500/10",
    line: "bg-gray-500",
    label: "Upcoming",
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className = "" }: TimelineProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/[0.06]" />

      <div className="space-y-8">
        {items.map((item) => {
          const config = statusConfig[item.status];
          const Icon = config.icon;

          return (
            <div key={item.id} className="relative flex gap-4">
              {/* Icon */}
              <div
                className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${config.bg}`}
              >
                <Icon className={`h-6 w-6 ${config.color}`} />
              </div>

              {/* Content */}
              <div className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">
                    {item.title}
                  </h3>
                  {item.date && (
                    <span className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-gray-400">
                      {item.date}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="mt-2 text-sm text-gray-400">
                    {item.description}
                  </p>
                )}
                {item.status === "completed" && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
                    <CheckCircle className="h-3 w-3" />
                    {config.label}
                  </div>
                )}
                {item.status === "in-progress" && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-amber-400">
                    <Clock className="h-3 w-3 animate-pulse" />
                    {config.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
