"use client";

import { useState, useMemo, useCallback } from "react";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Calendar as CalendarComponent, type CalendarEvent } from "@/components/ui/Calendar";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Campaign {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  status: "upcoming" | "active" | "ended";
  prize?: string;
}

interface CampaignCalendarProps {
  campaigns?: Campaign[];
  onCampaignClick?: (campaign: Campaign) => void;
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

function isInRange(day: Date, start: Date, end: Date): boolean {
  const d = day.getTime();
  return d >= start.getTime() && d <= end.getTime();
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const statusColors = {
  upcoming: "#3b82f6",
  active: "#22d3ee",
  ended: "#6b7280",
};

// ---------------------------------------------------------------------------
// CampaignCalendar
// ---------------------------------------------------------------------------

export function CampaignCalendar({
  campaigns = [],
  onCampaignClick,
  className = "",
}: CampaignCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Convert campaigns to calendar events
  const events: CalendarEvent[] = useMemo(() => {
    return campaigns.map((c) => ({
      date: c.startDate,
      label: c.title,
      color: statusColors[c.status],
    }));
  }, [campaigns]);

  // Get campaigns for selected date
  const selectedCampaigns = useMemo(() => {
    if (!selectedDate) return [];
    return campaigns.filter((c) => isInRange(selectedDate, c.startDate, c.endDate));
  }, [selectedDate, campaigns]);

  const handleDateChange = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const handleCampaignClick = useCallback(
    (campaign: Campaign) => {
      onCampaignClick?.(campaign);
    },
    [onCampaignClick]
  );

  return (
    <div className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-cyan-500/10">
          <Calendar className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Campaign Calendar</h3>
          <p className="text-sm text-gray-500">View campaign dates and deadlines</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <CalendarComponent
          value={selectedDate}
          onChange={handleDateChange}
          events={events}
        />

        {/* Campaign list for selected date */}
        <div className="space-y-3">
          <div className="text-sm text-gray-400 mb-4">
            {selectedDate ? (
              <span>
                Campaigns on <span className="text-white">{formatDate(selectedDate)}</span>
              </span>
            ) : (
              <span>Select a date to view campaigns</span>
            )}
          </div>

          {selectedCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <Clock className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">
                {selectedDate ? "No campaigns on this date" : "No date selected"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedCampaigns.map((campaign) => (
                <button
                  key={campaign.id}
                  onClick={() => handleCampaignClick(campaign)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition group"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: statusColors[campaign.status] }}
                    />
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">{campaign.title}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {campaign.prize && (
                      <span className="text-xs text-cyan-400">{campaign.prize}</span>
                    )}
                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="pt-4 border-t border-white/[0.06]">
            <p className="text-xs text-gray-500 mb-2">Status Legend</p>
            <div className="flex items-center gap-4">
              {Object.entries(statusColors).map(([status, color]) => (
                <div key={status} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
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
