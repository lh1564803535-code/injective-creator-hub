"use client";

import { useState, useCallback } from "react";
import { Check, BarChart3, Users } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PollOption {
  id: string;
  label: string;
  description?: string;
}

export interface PollProps {
  question: string;
  options: PollOption[];
  mode?: "single" | "multi";
  showResults?: boolean;
  totalVotes?: number;
  results?: Record<string, number>;
  onVote?: (selectedIds: string[]) => void;
  disabled?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Poll
// ---------------------------------------------------------------------------

export function Poll({
  question,
  options,
  mode = "single",
  showResults = false,
  totalVotes = 0,
  results,
  onVote,
  disabled = false,
  className = "",
}: PollProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(showResults);

  const toggle = useCallback(
    (id: string) => {
      if (submitted || disabled) return;
      if (mode === "single") {
        setSelected([id]);
      } else {
        setSelected((prev) =>
          prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
        );
      }
    },
    [mode, submitted, disabled],
  );

  const handleSubmit = useCallback(() => {
    if (selected.length === 0) return;
    setSubmitted(true);
    onVote?.(selected);
  }, [selected, onVote]);

  const getPercent = (id: string) => {
    if (!results || totalVotes === 0) return 0;
    return Math.round(((results[id] ?? 0) / totalVotes) * 100);
  };

  return (
    <div
      className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 ${className}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-cyan-400" />
        <span className="text-xs uppercase tracking-wider text-white/40">
          {mode === "multi" ? "Multi-select" : "Single-choice"} Poll
        </span>
      </div>

      {/* Question */}
      <h3 className="mb-4 text-base font-medium text-white">{question}</h3>

      {/* Options */}
      <div className="space-y-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.id);
          const pct = getPercent(opt.id);
          const count = results?.[opt.id] ?? 0;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              disabled={submitted || disabled}
              className={`relative w-full overflow-hidden rounded-lg border px-4 py-3 text-left transition ${
                submitted
                  ? "cursor-default border-white/[0.06]"
                  : isSelected
                    ? "border-cyan-500/50 bg-cyan-500/10"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
              }`}
            >
              {/* Result bar background */}
              {submitted && (
                <div
                  className="absolute inset-y-0 left-0 bg-cyan-500/10 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              )}

              <div className="relative z-10 flex items-center gap-3">
                {/* Indicator */}
                <div
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border transition ${
                    submitted && isSelected
                      ? "border-cyan-500 bg-cyan-500"
                      : isSelected
                        ? "border-cyan-500 bg-cyan-500/20"
                        : "border-white/[0.15] bg-transparent"
                  }`}
                >
                  {(submitted || isSelected) && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-white/80">{opt.label}</span>
                  {opt.description && (
                    <p className="mt-0.5 text-xs text-white/30">
                      {opt.description}
                    </p>
                  )}
                </div>

                {/* Result count */}
                {submitted && (
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span>{pct}%</span>
                    <span className="text-white/30">({count})</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-white/30">
          <Users className="h-3.5 w-3.5" />
          <span>{totalVotes.toLocaleString()} votes</span>
        </div>

        {!submitted && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={selected.length === 0 || disabled}
            className="rounded-lg bg-cyan-500 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Vote
          </button>
        )}
      </div>
    </div>
  );
}
