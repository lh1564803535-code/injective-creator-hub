"use client";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: number;
}

export function GlassCard({
  children,
  className = "",
  blur = 12,
}: GlassCardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl ${className}`}
      style={{
        backdropFilter: `blur(${blur}px)`,
      }}
    >
      {children}
    </div>
  );
}
