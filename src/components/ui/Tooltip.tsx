"use client";

import { useState, useRef, useEffect } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ content, children, position = "top" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 whitespace-nowrap rounded-lg bg-[#1a1a1a] px-3 py-2 text-xs text-white shadow-lg ${positionClasses[position]}`}
        >
          {content}
          <div
            className={`absolute h-2 w-2 rotate-45 bg-[#1a1a1a] ${
              position === "top" ? "bottom-[-4px] left-1/2 -translate-x-1/2" :
              position === "bottom" ? "top-[-4px] left-1/2 -translate-x-1/2" :
              position === "left" ? "right-[-4px] top-1/2 -translate-y-1/2" :
              "left-[-4px] top-1/2 -translate-y-1/2"
            }`}
          />
        </div>
      )}
    </div>
  );
}
