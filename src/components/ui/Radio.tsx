"use client";

import { forwardRef } from "react";

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex items-start gap-2">
        <div className="relative mt-0.5">
          <input
            ref={ref}
            type="radio"
            className={`peer h-5 w-5 cursor-pointer rounded-full border border-white/[0.06] bg-white/[0.02] transition ${
              error ? "border-red-500/50" : "border-white/[0.06]"
            } ${className}`}
            {...props}
          />
          <div className="pointer-events-none absolute left-1 top-1 h-3 w-3 rounded-full bg-white opacity-0 transition peer-checked:opacity-100" />
        </div>
        {label && (
          <label className="text-sm text-gray-300">{label}</label>
        )}
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Radio.displayName = "Radio";

// ---------------------------------------------------------------------------
// Radio Group
// ---------------------------------------------------------------------------

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  direction?: "vertical" | "horizontal";
}

export function RadioGroup({
  name,
  options,
  value,
  onChange,
  direction = "vertical",
}: RadioGroupProps) {
  return (
    <div
      className={`flex ${direction === "horizontal" ? "flex-row gap-4" : "flex-col gap-2"}`}
      role="radiogroup"
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const isDisabled = option.disabled ?? false;

        return (
          <label
            key={option.value}
            className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 transition ${
              isDisabled
                ? "cursor-not-allowed opacity-40"
                : isSelected
                  ? "bg-white/[0.06]"
                  : "hover:bg-white/[0.03]"
            }`}
          >
            <div className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => onChange(option.value)}
                className="peer sr-only"
              />
              <div
                className={`h-5 w-5 rounded-full border-2 transition ${
                  isSelected
                    ? "border-cyan-500"
                    : "border-white/20"
                }`}
              />
              <div
                className={`absolute h-2.5 w-2.5 rounded-full bg-cyan-500 transition-all duration-200 ${
                  isSelected
                    ? "scale-100 opacity-100"
                    : "scale-0 opacity-0"
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
  );
}