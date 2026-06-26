"use client";

interface GradientTextProps {
  children: React.ReactNode;
  from?: string;
  to?: string;
  via?: string;
  direction?: string;
  className?: string;
}

export function GradientText({
  children,
  from = "from-cyan-400",
  to = "to-blue-500",
  via,
  direction = "to-r",
  className = "",
}: GradientTextProps) {
  const gradient = via
    ? `bg-gradient-${direction} ${from} ${via} ${to}`
    : `bg-gradient-${direction} ${from} ${to}`;

  return (
    <span className={`${gradient} bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}
