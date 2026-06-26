"use client";

import { forwardRef, useEffect, useRef } from "react";
import { Check } from "lucide-react";

// --- Single Checkbox ---

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className = "", ...props }, ref) => {
    return (
      <label className="group flex items-start gap-3 cursor-pointer">
        <div className="relative mt-0.5 flex-shrink-0">
          <input
            ref={ref}
            type="checkbox"
            className={`peer h-5 w-5 cursor-pointer appearance-none rounded border bg-white/[0.02] transition-all duration-200 ${
              error
                ? "border-red-500/50"
                : "border-white/[0.06] hover:border-white/[0.15] checked:border-cyan-500 checked:bg-cyan-500/20"
            } ${className}`}
            {...props}
          />
          <Check className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 text-cyan-400 opacity-0 scale-75 transition-all duration-200 peer-checked:opacity-100 peer-checked:scale-100" />
        </div>
        <div className="flex-1 min-w-0">
          {label && (
            <span className={`text-sm transition-colors duration-150 ${
              props.disabled ? "text-white/30" : "text-white/80 group-hover:text-white"
            }`}>
              {label}
            </span>
          )}
          {description && (
            <p className="mt-0.5 text-xs text-white/30">{description}</p>
          )}
          {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

// --- Checkbox Group ---

interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface CheckboxGroupProps {
  options: CheckboxOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  columns?: 1 | 2 | 3;
}

export function CheckboxGroup({
  options,
  selected,
  onChange,
  label,
  helperText,
  error,
  disabled = false,
  columns = 1,
}: CheckboxGroupProps) {
  const handleChange = (value: string, checked: boolean) => {
    onChange(
      checked ? [...selected, value] : selected.filter((v) => v !== value)
    );
  };

  const gridCols = { 1: "grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" };

  return (
    <fieldset disabled={disabled}>
      {label && (
        <legend className="text-sm font-medium text-white/70 mb-3">{label}</legend>
      )}
      <div className={`grid gap-3 ${gridCols[columns]}`}>
        {options.map((option) => {
          const isChecked = selected.includes(option.value);
          return (
            <label
              key={option.value}
              className={`group flex items-start gap-3 rounded-lg border p-3 transition-all duration-200 cursor-pointer ${
                isChecked
                  ? "border-cyan-500/30 bg-cyan-500/[0.05]"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
              } ${option.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => handleChange(option.value, e.target.checked)}
                  disabled={option.disabled}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-white/[0.06] bg-white/[0.02] transition-all duration-200 checked:border-cyan-500 checked:bg-cyan-500/20"
                />
                <Check className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 text-cyan-400 opacity-0 scale-75 transition-all duration-200 peer-checked:opacity-100 peer-checked:scale-100" />
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-sm ${
                  isChecked ? "text-white" : "text-white/70 group-hover:text-white/90"
                }`}>
                  {option.label}
                </span>
                {option.description && (
                  <p className="mt-0.5 text-xs text-white/30">{option.description}</p>
                )}
              </div>
            </label>
          );
        })}
      </div>
      {helperText && !error && (
        <p className="mt-2 text-xs text-white/30">{helperText}</p>
      )}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </fieldset>
  );
}

// --- Select All Checkbox ---

interface SelectAllCheckboxProps {
  options: CheckboxOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label?: string;
  selectAllLabel?: string;
  disabled?: boolean;
}

export function SelectAllCheckbox({
  options,
  selected,
  onChange,
  label,
  selectAllLabel = "全选",
  disabled = false,
}: SelectAllCheckboxProps) {
  const allValues = options.filter((o) => !o.disabled).map((o) => o.value);
  const selectableSelected = selected.filter((v) => allValues.includes(v));
  const isAll = allValues.length > 0 && selectableSelected.length === allValues.length;
  const isPartial = selectableSelected.length > 0 && !isAll;
  const indeterminateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (indeterminateRef.current) {
      indeterminateRef.current.indeterminate = isPartial;
    }
  }, [isPartial]);

  const handleSelectAll = () => {
    onChange(isAll ? [] : allValues);
  };

  const handleChange = (value: string, checked: boolean) => {
    onChange(
      checked ? [...selected, value] : selected.filter((v) => v !== value)
    );
  };

  return (
    <fieldset disabled={disabled}>
      {label && (
        <legend className="text-sm font-medium text-white/70 mb-3">{label}</legend>
      )}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] divide-y divide-white/[0.06]">
        <label className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors">
          <div className="relative flex-shrink-0">
            <input
              ref={indeterminateRef}
              type="checkbox"
              checked={isAll}
              onChange={handleSelectAll}
              disabled={disabled}
              className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-white/[0.06] bg-white/[0.02] transition-all duration-200 checked:border-cyan-500 checked:bg-cyan-500/20"
            />
            <Check className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 text-cyan-400 opacity-0 scale-75 transition-all duration-200 peer-checked:opacity-100 peer-checked:scale-100" />
          </div>
          <span className="text-sm font-medium text-white/70">{selectAllLabel}</span>
          <span className="ml-auto text-xs text-white/30">
            {selectableSelected.length}/{allValues.length}
          </span>
        </label>

        {options.map((option) => {
          const isChecked = selected.includes(option.value);
          return (
            <label
              key={option.value}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                isChecked ? "bg-cyan-500/[0.03]" : "hover:bg-white/[0.02]"
              } ${option.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <div className="relative flex-shrink-0">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => handleChange(option.value, e.target.checked)}
                  disabled={option.disabled}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-white/[0.06] bg-white/[0.02] transition-all duration-200 checked:border-cyan-500 checked:bg-cyan-500/20"
                />
                <Check className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 text-cyan-400 opacity-0 scale-75 transition-all duration-200 peer-checked:opacity-100 peer-checked:scale-100" />
              </div>
              <span className={`text-sm ${isChecked ? "text-white" : "text-white/70"}`}>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
