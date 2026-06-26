"use client";

import { forwardRef } from "react";
import { Check } from "lucide-react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex items-start gap-2">
        <div className="relative mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            className={`peer h-5 w-5 cursor-pointer rounded border border-white/[0.06] bg-white/[0.02] transition ${
              error ? "border-red-500/50" : "border-white/[0.06]"
            } ${className}`}
            {...props}
          />
          <Check className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 text-white opacity-0 transition peer-checked:opacity-100" />
        </div>
        {label && (
          <label className="text-sm text-gray-300">{label}</label>
        )}
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";
