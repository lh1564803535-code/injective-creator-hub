"use client";

import { useState, useMemo, useCallback } from "react";
import { CalendarDays, FileText, Clock, CheckCircle2 } from "lucide-react";
import { Calendar as CalendarComponent, type CalendarEvent } from "@/components/ui/Calendar";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Submission {
  id: string;
  campaignTitle: string;
  deadline: Date;
  status: "pending" | "submitted" | "approved" | "rejected";
  reward?: string;
}

interface CreatorCalendarProps {
  submissions?: Submission[];
  onSubmissionClick?: (submission: Submission) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function daysUntil(d: Date): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

const statusConfig = {
  pending: { color: "#f59e0b", label: "Pending", icon: Clock },
  submitted: { color: "#3b82f6", label: "Submitted", icon: FileText },
  approved: { color: "#22c55e", label: "Approved", icon: CheckCircle2 },
  rejected: { color: "#ef4444", label: "Rejected", icon: FileText },
};

// ---------------------------------------------------------------------------
// CreatorCalendar
// ---------------------------------------------------------------------------

export function CreatorCalendar({
  submissions = [],
  onSubmissionClick,
  className = "",
}: CreatorCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Convert submissions to calendar events
  const events: CalendarEvent[] = useMemo(() => {
    return submissions.map((s) => ({
      date: s.deadline,
      label: s.campaignTitle,
      color: statusConfig[s.status].color,
    }));
  }, [submissions]);

  // Get submissions for selected date
  const selectedSubmissions = useMemo(() => {
    if (!selectedDate) return [];
    return submissions.filter((s) => isSameDay(s.deadline, selectedDate));
  }, [selectedDate, submissions]);

  // Get upcoming deadlines
  const upcomingDeadlines = useMemo(() => {
    return submissions
      .filter((s) => s.status === "pending" && daysUntil(s.deadline) > 0)
      .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
      .slice(0, 5);
  }, [submissions]);

  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleSubmissionClick = useCallback(
    (submission: Submission) => {
      onSubmissionClick?.(submission);
    },
    [onSubmissionClick]
  );

  return (
    <div className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <CalendarDays className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Creator Calendar</h3>
          <p className="text-sm text-gray-500">Track your submission deadlines</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <CalendarComponent
          value={selectedDate}
          onChange={handleDateChange}
          events={events}
        />

        {/* Right panel */}
        <div className="space-y-4">
          {/* Submissions for selected date */}
          <div>
            <div className="text-sm text-gray-400 mb-3">
              {selectedDate ? (
                <span>
                  Submissions due on <span className="text-white">{formatDate(selectedDate)}</span>
                </span>
              ) : (
                <span>Select a date to view submissions</span>
              )}
            </div>

            {selectedSubmissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                <Clock className="w-6 h-6 mb-2 opacity-50" />
                <p className="text-sm">
                  {selectedDate ? "No submissions due" : "No date selected"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedSubmissions.map((submission) => {
                  const StatusIcon = statusConfig[submission.status].icon;
                  return (
                    <button
                      key={submission.id}
                      onClick={() => handleSubmissionClick(submission)}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition"
                    >
                      <div className="flex items-center gap-3">
                        <StatusIcon
                          className="w-4 h-4"
                          style={{ color: statusConfig[submission.status].color }}
                        />
                        <div className="text-left">
                          <p className="text-sm font-medium text-white">
                            {submission.campaignTitle}
                          </p>
                          <p className="text-xs text-gray-500">
                            {statusConfig[submission.status].label}
                          </p>
                        </div>
                      </div>
                      {submission.reward && (
                        <span className="text-xs text-cyan-400">{submission.reward}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming deadlines */}
          <div className="pt-4 border-t border-white/[0.06]">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Upcoming Deadlines</h4>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-gray-500">No upcoming deadlines</p>
            ) : (
              <div className="space-y-2">
                {upcomingDeadlines.map((submission) => {
                  const days = daysUntil(submission.deadline);
                  return (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.02] transition cursor-pointer"
                      onClick={() => handleSubmissionClick(submission)}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: statusConfig[submission.status].color }}
                        />
                        <span className="text-sm text-white">{submission.campaignTitle}</span>
                      </div>
                      <span
                        className={`text-xs ${days <= 3 ? "text-red-400" : "text-gray-500"}`}
                      >
                        {days}d left
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status Legend */}
          <div className="pt-4 border-t border-white/[0.06]">
            <p className="text-xs text-gray-500 mb-2">Status Legend</p>
            <div className="flex flex-wrap items-center gap-3">
              {Object.entries(statusConfig).map(([status, config]) => (
                <div key={status} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                  <span className="text-xs text-gray-400 capitalize">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
