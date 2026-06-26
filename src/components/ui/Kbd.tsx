"use client";

interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

export function Kbd({ children, className = "" }: KbdProps) {
  return (
    <kbd
      className={`inline-flex items-center gap-1 rounded border border-white/[0.1] bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] text-gray-400 ${className}`}
    >
      {children}
    </kbd>
  );
}
