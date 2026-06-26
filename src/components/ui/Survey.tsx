"use client";

import { useState, useCallback } from "react";
import { CheckCircle2, Circle, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SurveyOption {
  value: string;
  label: string;
  description?: string;
}

export interface SurveyQuestion {
  id: string;
  question: string;
  type: "radio" | "checkbox" | "textarea";
  options?: SurveyOption[];
  required?: boolean;
  placeholder?: string;
}

export interface SurveyProps {
  title: string;
  description?: string;
  questions: SurveyQuestion[];
  onSubmit: (answers: Record<string, string | string[]>) => void;
  submitLabel?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Single Question Renderer
// ---------------------------------------------------------------------------

function SurveyQuestionItem({
  question,
  answer,
  onAnswer,
}: {
  question: SurveyQuestion;
  answer: string | string[] | undefined;
  onAnswer: (id: string, value: string | string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      {/* Question header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-3 min-w-0">
          {answer !== undefined && (Array.isArray(answer) ? answer.length > 0 : answer.length > 0) ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-400" />
          ) : (
            <Circle className="h-5 w-5 shrink-0 text-gray-600" />
          )}
          <span className="text-sm font-medium text-white truncate">
            {question.question}
            {question.required && <span className="ml-1 text-red-400">*</span>}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
        )}
      </button>

      {/* Question body */}
      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-white/[0.04]">
          {/* Radio options */}
          {question.type === "radio" && question.options && (
            <div className="mt-2 space-y-2">
              {question.options.map((option) => {
                const isSelected = answer === option.value;
                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 transition ${
                      isSelected ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                      <input
                        type="radio"
                        name={question.id}
                        value={option.value}
                        checked={isSelected}
                        onChange={() => onAnswer(question.id, option.value)}
                        className="peer sr-only"
                      />
                      <div
                        className={`h-5 w-5 rounded-full border-2 transition ${
                          isSelected ? "border-cyan-500" : "border-white/20"
                        }`}
                      />
                      <div
                        className={`absolute h-2.5 w-2.5 rounded-full bg-cyan-500 transition-all duration-200 ${
                          isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"
                        }`}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-medium transition ${
                          isSelected ? "text-white" : "text-gray-400"
                        }`}
                      >
                        {option.label}
                      </span>
                      {option.description && (
                        <span className="mt-0.5 text-xs text-gray-500">
                          {option.description}
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          {/* Checkbox options */}
          {question.type === "checkbox" && question.options && (
            <div className="mt-2 space-y-2">
              {question.options.map((option) => {
                const selected = Array.isArray(answer) ? answer : [];
                const isChecked = selected.includes(option.value);
                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 transition ${
                      isChecked ? "bg-cyan-500/[0.05] border border-cyan-500/20" : "hover:bg-white/[0.03] border border-transparent"
                    }`}
                  >
                    <div className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const next = isChecked
                            ? selected.filter((v) => v !== option.value)
                            : [...selected, option.value];
                          onAnswer(question.id, next);
                        }}
                        className="peer sr-only"
                      />
                      <div
                        className={`h-5 w-5 rounded border-2 transition ${
                          isChecked ? "border-cyan-500 bg-cyan-500/20" : "border-white/20 bg-white/[0.02]"
                        }`}
                      />
                      {isChecked && (
                        <CheckCircle2 className="absolute h-3.5 w-3.5 text-cyan-400" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium transition ${
                        isChecked ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          {/* Textarea */}
          {question.type === "textarea" && (
            <textarea
              value={typeof answer === "string" ? answer : ""}
              onChange={(e) => onAnswer(question.id, e.target.value)}
              placeholder={question.placeholder || "Type your answer..."}
              rows={4}
              className="mt-2 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500/30"
            />
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Survey
// ---------------------------------------------------------------------------

export function Survey({
  title,
  description,
  questions,
  onSubmit,
  submitLabel = "Submit Survey",
  className = "",
}: SurveyProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = useCallback((id: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const answeredCount = questions.filter((q) => {
    const a = answers[q.id];
    if (a === undefined) return false;
    if (Array.isArray(a)) return a.length > 0;
    return a.length > 0;
  }).length;

  const canSubmit =
    questions
      .filter((q) => q.required)
      .every((q) => {
        const a = answers[q.id];
        if (a === undefined) return false;
        if (Array.isArray(a)) return a.length > 0;
        return a.length > 0;
      });

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    onSubmit(answers);
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center backdrop-blur-sm ${className}`}>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Thank You!</h3>
        <p className="mt-2 text-sm text-gray-400">
          Your feedback has been submitted successfully.
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden ${className}`}>
      {/* Header */}
      <div className="border-b border-white/[0.04] px-5 py-4">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 rounded-full bg-white/[0.06]">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 tabular-nums">
            {answeredCount}/{questions.length}
          </span>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-3 p-5">
        {questions.map((question) => (
          <SurveyQuestionItem
            key={question.id}
            question={question}
            answer={answers[question.id]}
            onAnswer={handleAnswer}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.04] px-5 py-4 flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {questions.filter((q) => q.required).length > 0 && (
            <>Fields marked with <span className="text-red-400">*</span> are required</>
          )}
        </p>
        <Button
          variant="primary"
          size="md"
          onClick={handleSubmit}
          disabled={!canSubmit}
          loading={isSubmitting}
        >
          <Send className="h-4 w-4" />
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
