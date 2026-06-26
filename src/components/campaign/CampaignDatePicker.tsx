"use client";

import { useState, useCallback } from "react";
import { CalendarClock, AlertCircle } from "lucide-react";
import { DatePicker } from "@/components/ui/DatePicker";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CampaignDatePickerProps {
  deadline?: Date | null;
  startDate?: Date | null;
  onDeadlineChange?: (date: Date) => void;
  onStartDateChange?: (date: Date) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function daysUntil(d: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

// ---------------------------------------------------------------------------
// CampaignDatePicker
// ---------------------------------------------------------------------------

export function CampaignDatePicker({
  deadline = null,
  startDate = null,
  onDeadlineChange,
  onStartDateChange,
  className = "",
}: CampaignDatePickerProps) {
  const [startError, setStartError] = useState("");
  const [deadlineError, setDeadlineError] = useState("");

  const handleStartChange = useCallback(
    (d: Date) => {
      setStartError("");
      setDeadlineError("");
      if (deadline && d >= deadline) {
        setStartError("Start date must be before the deadline");
        return;
      }
      onStartDateChange?.(d);
    },
    [deadline, onStartDateChange]
  );

  const handleDeadlineChange = useCallback(
    (d: Date) => {
      setDeadlineError("");
      setStartError("");
      if (startDate && d <= startDate) {
        setDeadlineError("Deadline must be after the start date");
        return;
      }
      if (daysUntil(d) < 1) {
        setDeadlineError("Deadline must be at least 1 day from now");
        return;
      }
      onDeadlineChange?.(d);
    },
    [startDate, onDeadlineChange]
  );

  const remaining = deadline ? daysUntil(deadline) : null;

  return (
    <div
      className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 ${className}`}
    >
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10">
          <CalendarClock className="h-4 w-4 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">
            Campaign Schedule
          </h3>
          <p className="text-xs text-gray-500">
            Set the start and end dates for your campaign
          </p>
        </div>
      </div>

      {/* Date fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <DatePicker
          label="Start Date"
          placeholder="Select start date"
          value={startDate}
          onChange={handleStartChange}
          error={startError}
          maxDate={deadline ?? undefined}
        />
        <DatePicker
          label="Deadline"
          placeholder="Select deadline"
          value={deadline}
          onChange={handleDeadlineChange}
          error={deadlineError}
          minDate={startDate ?? undefined}
        />
      </div>

      {/* Duration indicator */}
      {startDate && deadline && !startError && !deadlineError && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
              style={{
                width: `${Math.min(100, Math.max(5, (remaining ?? 0) * 2))}%`,
              }}
            />
          </div>
          <span className="text-xs font-medium text-gray-400">
            {remaining !== null && remaining > 0
              ? `${remaining} day${remaining === 1 ? "" : "s"} remaining`
              : "Campaign ended"}
          </span>
        </div>
      )}

      {/* Validation message */}
      {deadline && remaining !== null && remaining < 3 && remaining >= 0 && (
        <div className="mt-3 flex items-start gap-2 text-xs text-amber-400">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            Short campaigns may receive fewer submissions. Consider at least 7
            days.
          </span>
        </div>
      )}
    </div>
  );
}
