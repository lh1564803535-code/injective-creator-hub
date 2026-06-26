"use client";

import { Gantt, type GanttTask } from "@/components/ui/Gantt";
import { Calendar, Clock } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CampaignPhase {
  id: string;
  label: string;
  startDate: Date;
  endDate: Date;
  status: "completed" | "in-progress" | "pending";
}

interface CampaignGanttProps {
  /** Campaign name */
  name: string;
  /** Phases to render */
  phases: CampaignPhase[];
  /** Overall status label */
  statusLabel?: string;
  /** Optional className for the outer wrapper */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDateRange(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  return `${start.toLocaleDateString("en-US", opts)} - ${end.toLocaleDateString("en-US", opts)}`;
}

function getOverallProgress(phases: CampaignPhase[]): number {
  if (phases.length === 0) return 0;
  const completed = phases.filter((p) => p.status === "completed").length;
  const inProgress = phases.filter((p) => p.status === "in-progress").length;
  return Math.round(((completed + inProgress * 0.5) / phases.length) * 100);
}

// ---------------------------------------------------------------------------
// Phase color mapping
// ---------------------------------------------------------------------------

const phaseColorMap: Record<string, string> = {
  submission: "bg-blue-500/60",
  voting: "bg-purple-500/60",
  settlement: "bg-amber-500/60",
  review: "bg-indigo-500/60",
};

function getPhaseColor(phaseId: string, status: CampaignPhase["status"]): string {
  if (status === "pending") return "bg-white/[0.08]";
  if (status === "completed") return "bg-emerald-500/60";
  return phaseColorMap[phaseId] || "bg-cyan-500/60";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CampaignGantt({
  name,
  phases,
  statusLabel,
  className = "",
}: CampaignGanttProps) {
  const progress = getOverallProgress(phases);

  const tasks: GanttTask[] = phases.map((phase) => ({
    id: phase.id,
    label: phase.label,
    startDate: phase.startDate,
    endDate: phase.endDate,
    status: phase.status,
    color: getPhaseColor(phase.id, phase.status),
  }));

  const now = new Date();
  const activePhase = phases.find((p) => p.status === "in-progress");
  const totalStart = phases[0]?.startDate;
  const totalEnd = phases[phases.length - 1]?.endDate;
  const isCompleted = phases.every((p) => p.status === "completed");

  return (
    <div
      className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] ${className}`}
    >
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-white/[0.04] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10">
            <Calendar className="h-4 w-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{name}</h3>
            {totalStart && totalEnd && (
              <p className="text-xs text-gray-500">
                {formatDateRange(totalStart, totalEnd)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status badge */}
          {statusLabel && (
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
                isCompleted
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-cyan-500/10 text-cyan-400"
              }`}
            >
              {statusLabel}
            </span>
          )}

          {/* Progress */}
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Active phase indicator */}
      {activePhase && (
        <div className="flex items-center gap-2 border-b border-white/[0.04] bg-white/[0.01] px-6 py-2.5">
          <Clock className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span className="text-xs text-gray-400">
            Current phase:{" "}
            <span className="font-medium text-cyan-400">
              {activePhase.label}
            </span>
          </span>
        </div>
      )}

      {/* Gantt chart */}
      <div className="p-4">
        <Gantt tasks={tasks} timeScale="day" />
      </div>

      {/* Phase legend */}
      <div className="flex flex-wrap gap-3 border-t border-white/[0.04] px-6 py-3">
        {phases.map((phase) => (
          <div key={phase.id} className="flex items-center gap-1.5">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                phase.status === "completed"
                  ? "bg-emerald-500"
                  : phase.status === "in-progress"
                    ? "bg-cyan-500"
                    : "bg-white/[0.15]"
              }`}
            />
            <span
              className={`text-[10px] ${
                phase.status === "completed"
                  ? "text-emerald-400"
                  : phase.status === "in-progress"
                    ? "text-cyan-400"
                    : "text-gray-600"
              }`}
            >
              {phase.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
