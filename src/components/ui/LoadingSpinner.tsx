"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "cyan" | "amber" | "emerald";
}

export function LoadingSpinner({ size = "md", color = "cyan" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const colorClasses = {
    cyan: "border-cyan-500",
    amber: "border-amber-500",
    emerald: "border-emerald-500",
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]}`}
    />
  );
}

export function LoadingPage() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-1/3 rounded bg-white/[0.06]" />
        <div className="h-3 w-2/3 rounded bg-white/[0.04]" />
        <div className="h-3 w-1/2 rounded bg-white/[0.04]" />
      </div>
    </div>
  );
}
