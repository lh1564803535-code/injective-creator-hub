"use client";

import { useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CalendarEvent {
  date: Date;
  label: string;
  color?: string;
}

interface CalendarProps {
  value?: Date | null;
  onChange?: (date: Date) => void;
  events?: CalendarEvent[];
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
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

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

// ---------------------------------------------------------------------------
// Calendar
// ---------------------------------------------------------------------------

export function Calendar({
  value = null,
  onChange,
  events = [],
  minDate,
  maxDate,
  className = "",
}: CalendarProps) {
  const [viewDate, setViewDate] = useState(() => value || new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = useMemo(() => getDaysInMonth(year, month), [year, month]);
  const firstDay = useMemo(() => getFirstDayOfMonth(year, month), [year, month]);

  const today = useMemo(() => startOfDay(new Date()), []);

  const eventMap = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((evt) => {
      const key = `${evt.date.getFullYear()}-${evt.date.getMonth()}-${evt.date.getDate()}`;
      const existing = map.get(key) || [];
      map.set(key, [...existing, evt]);
    });
    return map;
  }, [events]);

  const isDisabled = useCallback(
    (day: Date): boolean => {
      if (minDate && day < startOfDay(minDate)) return true;
      if (maxDate && day > startOfDay(maxDate)) return true;
      return false;
    },
    [minDate, maxDate]
  );

  const handlePrev = useCallback(() => {
    setViewDate(new Date(year, month - 1, 1));
  }, [year, month]);

  const handleNext = useCallback(() => {
    setViewDate(new Date(year, month + 1, 1));
  }, [year, month]);

  const handleDayClick = useCallback(
    (day: number) => {
      const d = new Date(year, month, day);
      if (isDisabled(d)) return;
      onChange?.(d);
    },
    [year, month, onChange, isDisabled]
  );

  const getEventsForDay = useCallback(
    (day: number): CalendarEvent[] => {
      const key = `${year}-${month}-${day}`;
      return eventMap.get(key) || [];
    },
    [year, month, eventMap]
  );

  // Build calendar grid
  const weeks: (number | null)[][] = useMemo(() => {
    const result: (number | null)[][] = [];
    let currentWeek: (number | null)[] = new Array(firstDay).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      result.push(currentWeek);
    }

    return result;
  }, [firstDay, daysInMonth]);

  return (
    <div className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrev}
          className="p-2 rounded-lg hover:bg-white/[0.06] transition text-gray-400 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-white">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={handleNext}
          className="p-2 rounded-lg hover:bg-white/[0.06] transition text-gray-400 hover:text-white"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-xs text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {weeks.map((week, weekIdx) =>
          week.map((day, dayIdx) => {
            if (day === null) {
              return <div key={`empty-${weekIdx}-${dayIdx}`} className="p-1" />;
            }

            const d = new Date(year, month, day);
            const isSelected = value ? isSameDay(d, value) : false;
            const isToday = isSameDay(d, today);
            const disabled = isDisabled(d);
            const dayEvents = getEventsForDay(day);

            return (
              <button
                key={`day-${day}`}
                onClick={() => handleDayClick(day)}
                disabled={disabled}
                className={`
                  relative p-1.5 rounded-lg text-sm transition
                  ${isSelected ? "bg-cyan-500/20 text-cyan-400 font-medium" : ""}
                  ${isToday && !isSelected ? "bg-white/[0.06] text-white" : ""}
                  ${!isSelected && !isToday ? "text-gray-400 hover:bg-white/[0.04] hover:text-white" : ""}
                  ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                <span>{day}</span>
                {dayEvents.length > 0 && (
                  <div className="flex justify-center gap-0.5 mt-0.5">
                    {dayEvents.slice(0, 3).map((evt, i) => (
                      <span
                        key={i}
                        className="block w-1 h-1 rounded-full"
                        style={{ backgroundColor: evt.color || "#22d3ee" }}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
