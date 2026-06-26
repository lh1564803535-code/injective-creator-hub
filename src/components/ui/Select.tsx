"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface BaseSelectProps {
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  maxHeight?: number;
}

interface SingleSelectProps extends BaseSelectProps {
  multiple?: false;
  value?: string;
  onChange?: (value: string) => void;
}

interface MultiSelectProps extends BaseSelectProps {
  multiple: true;
  value?: string[];
  onChange?: (value: string[]) => void;
}

export type SelectProps = SingleSelectProps | MultiSelectProps;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Select({
  options,
  label,
  placeholder = "Select...",
  error,
  helperText,
  searchable = false,
  searchPlaceholder = "Search...",
  multiple = false,
  disabled = false,
  className = "",
  maxHeight = 240,
  value,
  onChange,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Filter options by search query
  const filtered = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  // Resolve display text
  const displayText = useMemo(() => {
    if (multiple) {
      const selected = (value as string[] | undefined) ?? [];
      if (selected.length === 0) return placeholder;
      if (selected.length === 1) {
        return options.find((o) => o.value === selected[0])?.label ?? placeholder;
      }
      return `${selected.length} selected`;
    }
    const single = value as string | undefined;
    if (!single) return placeholder;
    return options.find((o) => o.value === single)?.label ?? placeholder;
  }, [multiple, value, options, placeholder]);

  // Check if an option is selected
  const isSelected = useCallback(
    (optValue: string) => {
      if (multiple) {
        return ((value as string[] | undefined) ?? []).includes(optValue);
      }
      return (value as string | undefined) === optValue;
    },
    [multiple, value],
  );

  // Toggle option
  const toggleOption = useCallback(
    (optValue: string) => {
      if (multiple) {
        const current = (value as string[] | undefined) ?? [];
        const next = current.includes(optValue)
          ? current.filter((v) => v !== optValue)
          : [...current, optValue];
        (onChange as ((v: string[]) => void) | undefined)?.(next);
      } else {
        (onChange as ((v: string) => void) | undefined)?.(optValue);
        setIsOpen(false);
        setSearch("");
      }
    },
    [multiple, value, onChange],
  );

  // Clear all selections (multi only)
  const clearAll = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      (onChange as ((v: string[]) => void) | undefined)?.([]);
    },
    [onChange],
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable) {
      // Small delay to ensure the input is rendered
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [isOpen, searchable]);

  const hasValue = multiple
    ? ((value as string[] | undefined) ?? []).length > 0
    : !!(value as string | undefined);

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) setSearch("");
        }}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-white/[0.02] px-4 py-2.5 text-sm outline-none transition ${
          error
            ? "border-red-500/50 focus:border-red-500"
            : isOpen
              ? "border-cyan-500/40"
              : "border-white/[0.06] hover:border-white/[0.12]"
        } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
      >
        <span className={`truncate ${hasValue ? "text-white" : "text-gray-500"}`}>
          {displayText}
        </span>
        <span className="flex items-center gap-1">
          {multiple && hasValue && (
            <span
              onClick={clearAll}
              className="rounded p-0.5 text-gray-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              <X size={14} />
            </span>
          )}
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="relative z-50 mt-1">
          <div
            className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d0f] shadow-xl shadow-black/40"
          >
            {/* Search */}
            {searchable && (
              <div className="border-b border-white/[0.06] p-2">
                <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-2">
                  <Search size={14} className="shrink-0 text-gray-500" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="text-gray-500 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Options */}
            <ul
              className="overflow-y-auto py-1"
              style={{ maxHeight: `${maxHeight}px` }}
            >
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-center text-sm text-gray-500">
                  No options found
                </li>
              ) : (
                filtered.map((opt) => {
                  const selected = isSelected(opt.value);
                  return (
                    <li key={opt.value}>
                      <button
                        type="button"
                        disabled={opt.disabled}
                        onClick={() => toggleOption(opt.value)}
                        className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition ${
                          opt.disabled
                            ? "cursor-not-allowed text-gray-600"
                            : selected
                              ? "bg-cyan-500/10 text-cyan-400"
                              : "text-gray-300 hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        {/* Multi checkbox */}
                        {multiple && (
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                              selected
                                ? "border-cyan-500 bg-cyan-500"
                                : "border-white/20 bg-transparent"
                            }`}
                          >
                            {selected && <Check size={12} className="text-white" />}
                          </span>
                        )}

                        {/* Icon */}
                        {opt.icon && (
                          <span className="shrink-0 text-gray-400">{opt.icon}</span>
                        )}

                        {/* Label */}
                        <span className="flex-1 truncate">{opt.label}</span>

                        {/* Single check indicator */}
                        {!multiple && selected && (
                          <Check size={14} className="shrink-0 text-cyan-400" />
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
