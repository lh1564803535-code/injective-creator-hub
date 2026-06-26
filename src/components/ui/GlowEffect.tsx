"use client";

interface GlowEffectProps {
  children: React.ReactNode;
  color?: string;
  size?: number;
  className?: string;
}

export function GlowEffect({
  children,
  color = "rgba(34, 211, 238, 0.3)",
  size = 100,
  className = "",
}: GlowEffectProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)`,
          filter: `blur(${size / 4}px)`,
        }}
      />
      {children}
    </div>
  );
}
