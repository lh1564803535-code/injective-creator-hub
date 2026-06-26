"use client";

import { useState, useCallback, useMemo } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { DatePicker } from "@/components/ui/DatePicker";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Preset = "today" | "this_week" | "this_month" | "custom";

interface DateRange {
  start: Date;
  end: Date;
}

interface CreatorDatePickerProps {
  onChange?: (range: DateRange, preset: Preset) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

function endOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(23, 59, 59, 999);
  return r;
}

function getToday(): DateRange {
  const now = new Date();
  return { start: startOfDay(now), end: endOfDay(now) };
}

function getThisWeek(): DateRange {
  const now = new Date();
  const day = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - day);
  start.setHours(0, 0, 0, 0);
  return { start, end: endOfDay(now) };
}

function getThisMonth(): DateRange {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  start.setHours(0, 0, 0, 0);
  return { start, end: endOfDay(now) };
}

function formatShort(d: Date): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

// ---------------------------------------------------------------------------
// PresetButton
// ---------------------------------------------------------------------------

function PresetButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-cyan-500/15 text-cyan-400"
          : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-300"
      }`}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// CreatorDatePicker
// ---------------------------------------------------------------------------

export function CreatorDatePicker({
  onChange,
  className = "",
}: CreatorDatePickerProps) {
  const [preset, setPreset] = useState<Preset>("this_month");
  const [showCustom, setShowCustom] = useState(false);

  const currentRange = useMemo(() => {
    switch (preset) {
      case "today":
        return getToday();
      case "this_week":
        return getThisWeek();
      case "this_month":
        return getThisMonth();
      default:
        return null;
    }
  }, [preset]);

  const handlePreset = useCallback(
    (p: Preset) => {
      setPreset(p);
      setShowCustom(false);
      if (p !== "custom") {
        const range =
          p === "today"
            ? getToday()
            : p === "this_week"
            ? getThisWeek()
            : getThisMonth();
        onChange?.(range, p);
      }
    },
    [onChange]
  );

  const [customStart, setCustomStart] = useState<Date | null>(null);
  const [customEnd, setCustomEnd] = useState<Date | null>(null);

  const handleCustomStart = useCallback(
    (d: Date) => {
      setCustomStart(d);
      if (customEnd) {
        onChange?.({ start: startOfDay(d), end: endOfDay(customEnd) }, "custom");
      }
    },
    [customEnd, onChange]
  );

  const handleCustomEnd = useCallback(
    (d: Date) => {
      setCustomEnd(d);
      if (customStart) {
        onChange?.({ start: startOfDay(customStart), end: endOfDay(d) }, "custom");
      }
    },
    [customStart, onChange]
  );

  const displayRange = useMemo(() => {
    if (preset === "custom") {
      if (customStart && customEnd)
        return `${formatShort(customStart)} - ${formatShort(customEnd)}`;
      return "Select range";
    }
    if (!currentRange) return "Select range";
    return `${formatShort(currentRange.start)} - ${formatShort(currentRange.end)}`;
  }, [preset, currentRange, customStart, customEnd]);

  return (
    <div
      className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 ${className}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-medium text-white">Date Range</span>
        </div>
        <span className="text-xs text-gray-500">{displayRange}</span>
      </div>

      {/* Preset buttons */}
      <div className="mb-4 flex flex-wrap gap-1.5 rounded-xl border border-white/[0.04] bg-white/[0.01] p-1">
        <PresetButton
          label="Today"
          active={preset === "today"}
          onClick={() => handlePreset("today")}
        />
        <PresetButton
          label="This Week"
          active={preset === "this_week"}
          onClick={() => handlePreset("this_week")}
        />
        <PresetButton
          label="This Month"
          active={preset === "this_month"}
          onClick={() => handlePreset("this_month")}
        />
        <PresetButton
          label="Custom"
          active={preset === "custom"}
          onClick={() => {
            setPreset("custom");
            setShowCustom(true);
          }}
        />
      </div>

      {/* Custom range pickers */}
      {showCustom && (
        <div className="grid gap-3 sm:grid-cols-2">
          <DatePicker
            label="From"
            placeholder="Start date"
            value={customStart}
            onChange={handleCustomStart}
            maxDate={customEnd ?? undefined}
          />
          <DatePicker
            label="To"
            placeholder="End date"
            value={customEnd}
            onChange={handleCustomEnd}
            minDate={customStart ?? undefined}
          />
        </div>
      )}

      {/* Current range display bar */}
      {currentRange && preset !== "custom" && (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.04]">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-cyan-500/40 to-blue-500/40" />
        </div>
      )}
    </div>
  );
}
