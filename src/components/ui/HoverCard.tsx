"use client";

import { useState, useRef, useEffect } from "react";

interface HoverCardProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function HoverCard({
  trigger,
  content,
  side = "bottom",
  className = "",
}: HoverCardProps) {
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

  const getPositionClasses = () => {
    switch (side) {
      case "top": return "bottom-full left-1/2 -translate-x-1/2 mb-2";
      case "bottom": return "top-full left-1/2 -translate-x-1/2 mt-2";
      case "left": return "right-full top-1/2 -translate-y-1/2 mr-2";
      case "right": return "left-full top-1/2 -translate-y-1/2 ml-2";
    }
  };

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 ${getPositionClasses()}`}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="rounded-xl border border-white/[0.08] bg-[#1a1a1a] p-4 shadow-xl">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}
