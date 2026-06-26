"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export interface ActionDropdownItem {
  key: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

interface ActionDropdownProps {
  trigger?: ReactNode;
  items: ActionDropdownItem[];
  showDividers?: boolean;
  align?: "left" | "right";
  className?: string;
}

export function ActionDropdown({
  trigger,
  items,
  showDividers = true,
  align = "right",
  className = "",
}: ActionDropdownProps) {
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

  const alignClass = align === "left" ? "left-0" : "right-0";

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger ?? (
          <button className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-sm text-gray-400 transition hover:bg-white/[0.05] hover:text-white">
            <ChevronDown
              className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        )}
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
