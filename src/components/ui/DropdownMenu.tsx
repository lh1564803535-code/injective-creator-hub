"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";

export interface DropdownMenuItem {
  key: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownMenuItem[];
  showDividers?: boolean;
  align?: "left" | "right";
  className?: string;
}

export function DropdownMenu({
  trigger,
  items,
  showDividers = true,
  align = "right",
  className = "",
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const alignClass = align === "left" ? "left-0" : "right-0";

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute ${alignClass} top-full z-50 mt-1 min-w-[180px] animate-fade-in rounded-xl border border-white/[0.08] bg-[#1a1a1a] py-1 shadow-xl shadow-black/40`}
        >
          {items.map((item, index) => (
            <div key={item.key}>
              {showDividers && index > 0 && (
                <div className="mx-3 my-1 border-t border-white/[0.06]" />
              )}
              <button
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick();
                    setIsOpen(false);
                  }
                }}
                disabled={item.disabled}
                className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm transition ${
                  item.disabled
                    ? "cursor-not-allowed text-gray-600"
                    : item.danger
                      ? "text-red-400 hover:bg-red-500/10"
                      : "text-gray-300 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {item.icon && (
                  <span className="flex h-4 w-4 items-center justify-center text-gray-500">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
