"use client";

interface SkeletonProps {
  width?: string;
  height?: string;
  variant?: "text" | "circular" | "rectangular";
  className?: string;
}

export function Skeleton({
  width,
  height,
  variant = "text",
  className = "",
}: SkeletonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "circular":
        return "rounded-full";
      case "rectangular":
        return "rounded-lg";
      default:
        return "rounded";
    }
  };

  return (
    <div
      className={`animate-pulse bg-white/[0.06] ${getVariantClasses()} ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? "60%" : "100%"}
          height="14px"
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 ${className}`}>
      <Skeleton width="40%" height="16px" className="mb-3" />
      <SkeletonText lines={2} className="mb-4" />
      <Skeleton width="100%" height="120px" />
    </div>
  );
}

export function SkeletonAvatar({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <Skeleton
      variant="circular"
      width={`${size}px`}
      height={`${size}px`}
      className={className}
    />
  );
}
