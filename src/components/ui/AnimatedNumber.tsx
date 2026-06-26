"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AnimatedNumberProps {
  /** Target value to animate to */
  value: number;
  /** Number of decimal places (default: 2) */
  decimals?: number;
  /** Show thousands separator comma */
  comma?: boolean;
  /** Prefix string (e.g. "$") */
  prefix?: string;
  /** Suffix string (e.g. "USDC") */
  suffix?: string;
  /** Animation duration in ms (default: 600) */
  duration?: number;
  /** Additional class names */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatNumber(
  value: number,
  decimals: number,
  comma: boolean
): string {
  const fixed = value.toFixed(decimals);
  if (!comma) return fixed;

  const [intPart, decPart] = fixed.split(".");
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart !== undefined ? `${formatted}.${decPart}` : formatted;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AnimatedNumber({
  value,
  decimals = 2,
  comma = true,
  prefix = "",
  suffix = "",
  duration = 600,
  className = "",
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const animate = useCallback(
    (from: number, to: number) => {
      cancelAnimationFrame(rafRef.current);
      startRef.current = 0;

      const step = (timestamp: number) => {
        if (!startRef.current) startRef.current = timestamp;
        const elapsed = timestamp - startRef.current;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = from + (to - from) * eased;

        setDisplay(current);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          setDisplay(to);
        }
      };

      rafRef.current = requestAnimationFrame(step);
    },
    [duration]
  );

  useEffect(() => {
    const from = prevRef.current;
    if (from !== value) {
      animate(from, value);
      prevRef.current = value;
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, animate]);

  const formatted = formatNumber(display, decimals, comma);

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      {formatted}
      {suffix && <span className="ml-1">{suffix}</span>}
    </span>
  );
}
