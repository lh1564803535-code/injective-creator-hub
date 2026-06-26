"use client";

interface IndicatorProps {
  variant?: "success" | "warning" | "error" | "info";
  pulse?: boolean;
  className?: string;
}

const variantClasses = {
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  error: "bg-red-400",
  info: "bg-cyan-400",
};

export function Indicator({
  variant = "success",
  pulse = false,
  className = "",
}: IndicatorProps) {
  return (
    <span className={`relative inline-flex h-2.5 w-2.5 ${className}`}>
      {pulse && (
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${variantClasses[variant]}`}
        />
      )}
      <span
        className={`relative inline-flex h-2.5 w-2.5 rounded-full ${variantClasses[variant]}`}
      />
    </span>
  );
}
