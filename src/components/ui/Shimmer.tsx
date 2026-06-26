"use client";

interface ShimmerProps {
  width?: string;
  height?: string;
  className?: string;
}

export function Shimmer({
  width = "100%",
  height = "20px",
  className = "",
}: ShimmerProps) {
  return (
    <div
      className={`shimmer rounded bg-white/[0.06] ${className}`}
      style={{ width, height }}
    />
  );
}

export function ShimmerText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer
          key={i}
          width={i === lines - 1 ? "60%" : "100%"}
          height="14px"
        />
      ))}
    </div>
  );
}

export function ShimmerCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 ${className}`}>
      <Shimmer width="40%" height="16px" className="mb-3" />
      <ShimmerText lines={2} className="mb-4" />
      <Shimmer width="100%" height="120px" />
    </div>
  );
}
