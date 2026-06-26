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
