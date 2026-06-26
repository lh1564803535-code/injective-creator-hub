"use client";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: "cyan" | "amber" | "emerald" | "purple";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const colorClasses = {
  cyan: "bg-cyan-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
  purple: "bg-purple-500",
};

const sizeClasses = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = "cyan",
  size = "md",
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={className}>
      {(label || showPercentage) && (
        <div className="mb-1 flex items-center justify-between">
          {label && <span className="text-xs text-gray-500">{label}</span>}
          {showPercentage && (
            <span className="text-xs text-gray-400">{Math.round(percentage)}%</span>
          )}
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
