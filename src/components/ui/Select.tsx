"use client";

import { forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, onChange, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full rounded-xl border bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none transition ${
            error
              ? "border-red-500/50 focus:border-red-500"
              : "border-white/[0.06] focus:border-cyan-500/30"
          } ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
