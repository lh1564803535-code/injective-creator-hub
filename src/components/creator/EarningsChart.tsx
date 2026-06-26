"use client";

import { useState, useEffect, useRef } from "react";
import { TrendingUp } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EarningsDataPoint {
  label: string;
  value: number; // USDC amount
}

interface EarningsChartProps {
  data: EarningsDataPoint[];
  title?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EarningsChart({
  data,
  title = "Earnings History",
  className = "",
}: EarningsChartProps) {
  const [animated, setAnimated] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animated]);

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const totalEarnings = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div
      ref={ref}
      className={`rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 ${className}`}
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-xs text-gray-500">
            Total:{" "}
            <span className="font-medium text-emerald-400">
              {totalEarnings.toLocaleString()} USDC
            </span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400">
          <TrendingUp className="h-3 w-3" />
          <span className="font-medium">
            +{((data[data.length - 1]?.value / Math.max(data[0]?.value, 1) - 1) * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end gap-1.5 h-32">
        {data.map((point, i) => {
          const heightPercent = (point.value / maxValue) * 100;
          const isHovered = hoveredIndex === i;
          const isLast = i === data.length - 1;

          return (
            <div
              key={point.label}
              className="group relative flex-1 flex flex-col items-center"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute bottom-full mb-2 z-10 whitespace-nowrap rounded-lg border border-white/[0.1] bg-[#1a1a1a] px-3 py-1.5 text-xs shadow-lg animate-fade-in-up">
                  <p className="font-semibold text-white">
                    {point.value.toLocaleString()} USDC
                  </p>
                  <p className="text-gray-500">{point.label}</p>
                </div>
              )}

              {/* Bar */}
              <div className="relative w-full flex items-end" style={{ height: "100%" }}>
                <div
                  className={`w-full rounded-t-md transition-all duration-700 ease-out ${
                    isLast
                      ? "bg-gradient-to-t from-emerald-500 to-emerald-400"
                      : isHovered
                        ? "bg-gradient-to-t from-cyan-500 to-cyan-400"
                        : "bg-gradient-to-t from-white/[0.08] to-white/[0.12]"
                  }`}
                  style={{
                    height: animated ? `${heightPercent}%` : "0%",
                    transitionDelay: `${i * 60}ms`,
                    boxShadow: isLast
                      ? "0 0 12px rgba(34, 197, 94, 0.2)"
                      : isHovered
                        ? "0 0 8px rgba(34, 210, 238, 0.15)"
                        : "none",
                  }}
                />
              </div>

              {/* Label */}
              <span
                className={`mt-2 text-[10px] transition-colors ${
                  isHovered || isLast ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
