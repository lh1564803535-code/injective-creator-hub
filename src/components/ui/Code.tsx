"use client";

interface CodeProps {
  children: React.ReactNode;
  className?: string;
}

export function Code({ children, className = "" }: CodeProps) {
  return (
    <code
      className={`rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-sm text-cyan-400 ${className}`}
    >
      {children}
    </code>
  );
}
