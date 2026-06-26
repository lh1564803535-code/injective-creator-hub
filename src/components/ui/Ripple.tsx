"use client";

import { useRef, useCallback } from "react";

interface RippleProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function Ripple({
  children,
  color = "rgba(255, 255, 255, 0.3)",
  className = "",
}: RippleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: ${color};
      width: 100px;
      height: 100px;
      left: ${x - 50}px;
      top: ${y - 50}px;
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      pointer-events: none;
    `;

    containerRef.current.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, [color]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
