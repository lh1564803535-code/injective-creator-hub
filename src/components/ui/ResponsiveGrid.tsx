"use client";

import { type ReactNode } from "react";

// ---------------------------------------------------------------------------
// Responsive Grid – CSS Grid based adaptive layout
// ---------------------------------------------------------------------------

interface ResponsiveGridProps {
  children: ReactNode;
  /** Number of columns at each breakpoint (default: 1-2-3-4) */
  cols?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  /** Gap between items in Tailwind units (default: 6) */
  gap?: number;
  /** Additional class names */
  className?: string;
}

export function ResponsiveGrid({
  children,
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 6,
  className = "",
}: ResponsiveGridProps) {
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols.sm ?? 1}, 1fr)`,
    gap: `${gap * 0.25}rem`,
  };

  return (
    <div
      className={`responsive-grid ${className}`}
      style={gridStyle}
      data-cols-md={cols.md}
      data-cols-lg={cols.lg}
      data-cols-xl={cols.xl}
    >
      <style jsx>{`
        .responsive-grid {
          width: 100%;
        }
        @media (min-width: 768px) {
          .responsive-grid {
            grid-template-columns: repeat(${cols.md ?? 2}, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .responsive-grid {
            grid-template-columns: repeat(${cols.lg ?? 3}, 1fr);
          }
        }
        @media (min-width: 1280px) {
          .responsive-grid {
            grid-template-columns: repeat(${cols.xl ?? 4}, 1fr);
          }
        }
      `}</style>
      {children}
    </div>
  );
}
