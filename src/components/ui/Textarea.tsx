"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "maxLength"> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, maxLength, className = "", onChange, value, defaultValue, ...props }, ref) => {
    const [charCount, setCharCount] = useState(
      typeof value === "string" ? value.length : typeof defaultValue === "string" ? defaultValue.length : 0
    );

    useEffect(() => {
      if (typeof value === "string") {
        setCharCount(value.length);
      }
    }, [value]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let newValue = e.target.value;
        if (maxLength && newValue.length > maxLength) {
          newValue = newValue.slice(0, maxLength);
          e.target.value = newValue;
        }
        setCharCount(newValue.length);
        onChange?.(e);
      },
      [maxLength, onChange]
    );

    const isNearLimit = maxLength !== undefined && charCount > maxLength * 0.9;
    const isAtLimit = maxLength !== undefined && charCount >= maxLength;

    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={`w-full rounded-xl border bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 ${
            error
              ? "border-red-500/50 focus:border-red-500"
              : "border-white/[0.06] focus:border-cyan-500/30"
          } ${className}`}
          {...props}
        />
        <div className="mt-1 flex items-center justify-between">
          <div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            {helperText && !error && (
              <p className="text-xs text-gray-500">{helperText}</p>
            )}
          </div>
          {maxLength !== undefined && (
            <span
              className={`text-xs tabular-nums ${
                isAtLimit
                  ? "text-red-400"
                  : isNearLimit
                    ? "text-amber-400"
                    : "text-white/30"
              }`}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
