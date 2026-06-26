"use client";

import { CheckCircle } from "lucide-react";

interface Step {
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className = "" }: StepperProps) {
  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  isCompleted
                    ? "border-emerald-500 bg-emerald-500"
                    : isCurrent
                    ? "border-cyan-500 bg-cyan-500/20"
                    : "border-white/[0.1] bg-white/[0.02]"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : (
                  <span className={`text-xs font-medium ${
                    isCurrent ? "text-cyan-400" : "text-gray-500"
                  }`}>
                    {index + 1}
                  </span>
                )}
              </div>
              <span className={`mt-1 text-[10px] ${
                isCompleted ? "text-emerald-400" : isCurrent ? "text-cyan-400" : "text-gray-500"
              }`}>
                {step.title}
              </span>
            </div>

            {!isLast && (
              <div className={`mx-2 h-0.5 w-8 ${
                isCompleted ? "bg-emerald-500" : "bg-white/[0.06]"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
