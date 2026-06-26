"use client";

interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular";
  width?: string;
  height?: string;
}

export function Skeleton({ variant = "text", width, height }: SkeletonProps) {
  const baseClasses = "animate-pulse bg-white/[0.06]";

  if (variant === "circular") {
    return (
      <div
        className={`${baseClasses} rounded-full`}
        style={{ width: width || "40px", height: height || "40px" }}
      />
    );
  }

  if (variant === "rectangular") {
    return (
      <div
        className={`${baseClasses} rounded-lg`}
        style={{ width: width || "100%", height: height || "20px" }}
      />
    );
  }

  return (
    <div
      className={`${baseClasses} rounded w-full`}
      style={{ height: height || "16px", width }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4">
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="40%" />
    </div>
  );
}

export function SkeletonAvatar() {
  return <Skeleton variant="circular" width="40px" height="40px" />;
}
