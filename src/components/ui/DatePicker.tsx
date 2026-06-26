"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DatePickerProps {
  value?: Date | null;
  range?: DateRange | null;
  mode?: "single" | "range";
  onChange?: (date: Date) => void;
  onRangeChange?: (range: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isInRange(day: Date, range: DateRange): boolean {
  if (!range.start || !range.end) return false;
  const d = startOfDay(day).getTime();
  const s = startOfDay(range.start).getTime();
  const e = startOfDay(range.end).getTime();
  return d >= Math.min(s, e) && d <= Math.max(s, e);
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDisplayDate(d: Date | null): string {
  if (!d) return "";
  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
}

// ---------------------------------------------------------------------------
// Calendar Grid
// ---------------------------------------------------------------------------

function CalendarGrid({
  year,
  month,
  selected,
  range,
  mode,
  minDate,
  maxDate,
  onDayClick,
}: {
  year: number;
  month: number;
  selected: Date | null;
  range: DateRange | null;
  mode: "single" | "range";
  minDate?: Date;
  maxDate?: Date;
  onDayClick: (d: Date) => void;
}) {
  const today = startOfDay(new Date());
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const cells: (Date | null)[] = [];

  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div className="grid grid-cols-7 gap-1">
      {WEEKDAYS.map((wd) => (
        <div
          key={wd}
          className="py-1 text-center text-[10px] font-medium uppercase tracking-wider text-gray-500"
        >
          {wd}
        </div>
      ))}
      {cells.map((day, i) => {
        if (!day) return <div key={`empty-${i}`} />;

        const isToday = isSameDay(day, today);
        const isSelected =
          mode === "single" && selected ? isSameDay(day, selected) : false;
        const inRange = mode === "range" && range ? isInRange(day, range) : false;
        const isStart =
          mode === "range" && range?.start ? isSameDay(day, range.start) : false;
        const isEnd =
          mode === "range" && range?.end ? isSameDay(day, range.end) : false;
        const disabled =
          (minDate && startOfDay(day) < startOfDay(minDate)) ||
          (maxDate && startOfDay(day) > startOfDay(maxDate));

        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => onDayClick(day)}
            className={`
              relative flex h-8 w-8 items-center justify-center rounded-lg text-sm transition
              ${disabled ? "cursor-not-allowed text-gray-600" : "cursor-pointer hover:bg-white/[0.08]"}
              ${isSelected || isStart || isEnd ? "bg-cyan-500/20 font-semibold text-cyan-400" : ""}
              ${inRange && !isSelected && !isStart && !isEnd ? "bg-white/[0.04] text-gray-300" : ""}
              ${isToday && !isSelected && !isStart && !isEnd ? "ring-1 ring-cyan-500/40" : ""}
              ${!isSelected && !isStart && !isEnd && !inRange && !disabled ? "text-gray-300" : ""}
            `}
          >
            {day.getDate()}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DatePicker
// ---------------------------------------------------------------------------

export function DatePicker({
  value = null,
  range = null,
  mode = "single",
  onChange,
  onRangeChange,
  minDate,
  maxDate,
  label,
  placeholder = "Select date",
  error,
  className = "",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(
    () => value ?? range?.start ?? new Date()
  );
  const [tempRange, setTempRange] = useState<DateRange>(
    range ?? { start: null, end: null }
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const prevMonth = useCallback(() => {
    setViewDate(new Date(year, month - 1, 1));
  }, [year, month]);

  const nextMonth = useCallback(() => {
    setViewDate(new Date(year, month + 1, 1));
  }, [year, month]);

  const handleDayClick = useCallback(
    (d: Date) => {
      if (mode === "single") {
        onChange?.(d);
        setOpen(false);
      } else {
        // Range mode
        if (!tempRange.start || (tempRange.start && tempRange.end)) {
          setTempRange({ start: d, end: null });
        } else {
          const newRange: DateRange = {
            start: tempRange.start,
            end: d,
          };
          // Normalize so start <= end
          if (newRange.start && newRange.end && newRange.start > newRange.end) {
            newRange.start = d;
            newRange.end = tempRange.start;
          }
          setTempRange(newRange);
          onRangeChange?.(newRange);
          setOpen(false);
        }
      }
    },
    [mode, onChange, onRangeChange, tempRange]
  );

  const displayText = useMemo(() => {
    if (mode === "single" && value) return formatDisplayDate(value);
    if (mode === "range") {
      const r = range ?? tempRange;
      if (r.start && r.end)
        return `${formatDisplayDate(r.start)} - ${formatDisplayDate(r.end)}`;
      if (r.start) return `${formatDisplayDate(r.start)} - ...`;
    }
    return "";
  }, [mode, value, range, tempRange]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center gap-2 rounded-xl border bg-white/[0.02] px-4 py-2.5 text-sm transition outline-none ${
          error
            ? "border-red-500/50 focus:border-red-500"
            : "border-white/[0.06] focus:border-cyan-500/30"
        } ${displayText ? "text-white" : "text-gray-500"}`}
      >
        <Calendar className="h-4 w-4 text-gray-500" />
        <span className="flex-1 text-left">{displayText || placeholder}</span>
      </button>

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-72 rounded-2xl border border-white/[0.06] bg-[#0a0a0f] p-4 shadow-2xl">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-white">
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Grid */}
          <CalendarGrid
            year={year}
            month={month}
            selected={value}
            range={mode === "range" ? tempRange : null}
            mode={mode}
            minDate={minDate}
            maxDate={maxDate}
            onDayClick={handleDayClick}
          />
        </div>
      )}
    </div>
  );
}
