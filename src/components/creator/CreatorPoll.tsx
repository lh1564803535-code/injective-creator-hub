"use client";

import { useState, useCallback } from "react";
import {
  Check,
  ClipboardList,
  MessageSquare,
  Users,
  Star,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FeedbackOption {
  id: string;
  label: string;
}

interface FeedbackQuestion {
  id: string;
  question: string;
  type: "single" | "rating";
  options?: FeedbackOption[];
  maxRating?: number;
}

export interface CreatorPollProps {
  title: string;
  description?: string;
  questions: FeedbackQuestion[];
  onSubmit?: (answers: Record<string, string | number>) => void;
  disabled?: boolean;
  className?: string;
}

// ---------------------------------------------------------------------------
// Creator Poll
// ---------------------------------------------------------------------------

export function CreatorPoll({
  title,
  description,
  questions,
  onSubmit,
  disabled = false,
  className = "",
}: CreatorPollProps) {
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSingle = useCallback(
    (questionId: string, optionId: string) => {
      if (submitted || disabled) return;
      setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    },
    [submitted, disabled],
  );

  const handleRating = useCallback(
    (questionId: string, value: number) => {
      if (submitted || disabled) return;
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    [submitted, disabled],
  );

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    onSubmit?.(answers);
  }, [submitted, answers, onSubmit]);

  const answeredCount = Object.keys(answers).length;
  const progress =
    questions.length > 0
      ? Math.round((answeredCount / questions.length) * 100)
      : 0;

  return (
    <div
      className={`rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 ${className}`}
    >
      {/* Header */}
      <div className="mb-1 flex items-center gap-2">
        <ClipboardList className="h-4 w-4 text-violet-400" />
        <span className="text-xs uppercase tracking-wider text-white/40">
          Creator Survey
        </span>
      </div>
      <h3 className="mb-1 text-base font-medium text-white">{title}</h3>
      {description && (
        <p className="mb-4 text-sm text-white/40">{description}</p>
      )}

      {/* Progress bar */}
      <div className="mb-5 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-violet-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-white/30">
          {answeredCount}/{questions.length}
        </span>
      </div>

      {/* Questions */}
      <div className="space-y-5">
        {questions.map((q, idx) => (
          <div key={q.id}>
            <p className="mb-2 text-sm font-medium text-white/80">
              <span className="mr-2 text-white/30">{idx + 1}.</span>
              {q.question}
            </p>

            {/* Single-choice options */}
            {q.type === "single" && q.options && (
              <div className="space-y-1.5 pl-5">
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSingle(q.id, opt.id)}
                      disabled={submitted || disabled}
                      className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-sm transition ${
                        isSelected
                          ? "border-violet-500/50 bg-violet-500/10 text-white"
                          : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:border-white/[0.12] hover:bg-white/[0.04]"
                      }`}
                    >
                      <div
                        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-violet-500 bg-violet-500"
                            : "border-white/[0.15]"
                        }`}
                      >
                        {isSelected && (
                          <Check className="h-2.5 w-2.5 text-white" />
                        )}
                      </div>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Rating */}
            {q.type === "rating" && (
              <div className="flex gap-1.5 pl-5">
                {Array.from(
                  { length: q.maxRating ?? 5 },
                  (_, i) => i + 1,
                ).map((val) => {
                  const current = answers[q.id];
                  const isActive =
                    typeof current === "number" && val <= current;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleRating(q.id, val)}
                      disabled={submitted || disabled}
                      className="transition hover:scale-110"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          isActive
                            ? "fill-amber-400 text-amber-400"
                            : "text-white/[0.15] hover:text-white/30"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
        <div className="flex items-center gap-1.5 text-xs text-white/30">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Feedback is anonymous</span>
        </div>

        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={answeredCount === 0 || disabled}
            className="rounded-lg bg-violet-500 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit
          </button>
        ) : (
          <span className="flex items-center gap-1 text-xs text-emerald-400">
            <Check className="h-3.5 w-3.5" />
            Submitted
          </span>
        )}
      </div>
    </div>
  );
}
