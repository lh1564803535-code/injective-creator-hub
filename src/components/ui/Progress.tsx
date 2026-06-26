"use client";

interface ProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: "cyan" | "amber" | "emerald" | "purple";
  showLabel?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

const colorClasses = {
  cyan: "bg-cyan-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  purple: "bg-purple-500",
};

export function Progress({
  value,
  max = 100,
  size = "md",
  color = "cyan",
  showLabel = false,
  className = "",
}: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-gray-500">{value}</span>
          <span className="text-gray-500">{max}</span>
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-white/[0.06] ${sizeClasses[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
