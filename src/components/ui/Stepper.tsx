"use client";

import { Check } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type StepStatus = "completed" | "current" | "upcoming";

export interface Step {
  /** Unique key */
  key: string;
  /** Display label */
  label: string;
  /** Optional description below label */
  description?: string;
  /** Optional icon override */
  icon?: React.ReactNode;
  /** Computed status — if omitted the parent can derive it from `currentStep` */
  status?: StepStatus;
}

interface StepperProps {
  /** Ordered list of steps */
  steps: Step[];
  /** Index of the currently active step (0-based). Ignored when every step has an explicit `status`. */
  currentStep?: number;
  /** Layout direction */
  direction?: "horizontal" | "vertical";
  /** Accent colour for active step */
  accentColor?: "cyan" | "emerald" | "amber" | "purple";
  /** Additional class names */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const accentMap: Record<string, { ring: string; bg: string; text: string; line: string }> = {
  cyan: {
    ring: "ring-cyan-500",
    bg: "bg-cyan-500",
    text: "text-cyan-400",
    line: "bg-cyan-500",
  },
  emerald: {
    ring: "ring-emerald-500",
    bg: "bg-emerald-500",
    text: "text-emerald-400",
    line: "bg-emerald-500",
  },
  amber: {
    ring: "ring-amber-500",
    bg: "bg-amber-500",
    text: "text-amber-400",
    line: "bg-amber-500",
  },
  purple: {
    ring: "ring-purple-500",
    bg: "bg-purple-500",
    text: "text-purple-400",
    line: "bg-purple-500",
  },
};

function resolveStatus(step: Step, index: number, currentStep: number): StepStatus {
  if (step.status) return step.status;
  if (index < currentStep) return "completed";
  if (index === currentStep) return "current";
  return "upcoming";
}

// ---------------------------------------------------------------------------
// Indicator (shared between horizontal & vertical)
// ---------------------------------------------------------------------------

function StepIndicator({
  step,
  index,
  status,
  accent,
}: {
  step: Step;
  index: number;
  status: StepStatus;
  accent: (typeof accentMap)[string];
}) {
  const circleBase =
    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition";

  let circleClass: string;
  if (status === "completed") {
    circleClass = `${accent.bg} text-white`;
  } else if (status === "current") {
    circleClass = `bg-white/[0.08] ring-2 ${accent.ring} ${accent.text}`;
  } else {
    circleClass = "bg-white/[0.06] text-gray-500";
  }

  return (
    <div className={`${circleBase} ${circleClass} shrink-0`}>
      {status === "completed" ? (
        <Check className="h-4 w-4" />
      ) : step.icon ? (
        step.icon
      ) : (
        <span>{index + 1}</span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stepper
// ---------------------------------------------------------------------------

export function Stepper({
  steps,
  currentStep = 0,
  direction = "horizontal",
  accentColor = "cyan",
  className = "",
}: StepperProps) {
  const accent = accentMap[accentColor] ?? accentMap.cyan;

  /* ---- horizontal ---- */
  if (direction === "horizontal") {
    return (
      <div className={`flex items-start gap-0 ${className}`}>
        {steps.map((step, i) => {
          const status = resolveStatus(step, i, currentStep);
          const isLast = i === steps.length - 1;

          return (
            <div key={step.key} className={`flex flex-1 flex-col items-center ${!isLast ? "relative" : ""}`}>
              {/* connector line behind indicators */}
              {!isLast && (
                <div
                  className={`absolute top-4 left-[calc(50%+1rem)] h-0.5 w-[calc(100%-2rem)] ${
                    status === "completed" ? accent.line : "bg-white/[0.08]"
                  }`}
                />
              )}

              <StepIndicator step={step} index={i} status={status} accent={accent} />

              <div className="mt-2 text-center">
                <p
                  className={`text-xs font-medium ${
                    status === "current" ? accent.text : status === "completed" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="mt-0.5 text-[10px] text-gray-600">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /* ---- vertical ---- */
  return (
    <div className={`flex flex-col ${className}`}>
      {steps.map((step, i) => {
        const status = resolveStatus(step, i, currentStep);
        const isLast = i === steps.length - 1;

        return (
          <div key={step.key} className="flex gap-3">
            {/* left column: indicator + line */}
            <div className="flex flex-col items-center">
              <StepIndicator step={step} index={i} status={status} accent={accent} />
              {!isLast && (
                <div
                  className={`w-0.5 flex-1 ${
                    status === "completed" ? accent.line : "bg-white/[0.08]"
                  }`}
                />
              )}
            </div>

            {/* right column: text */}
            <div className="pb-6 pt-1">
              <p
                className={`text-sm font-medium ${
                  status === "current" ? accent.text : status === "completed" ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="mt-0.5 text-xs text-gray-600">{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
