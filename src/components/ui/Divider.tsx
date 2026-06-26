"use client";

interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className = "" }: DividerProps) {
  if (label) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-xs text-gray-500">{label}</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>
    );
  }

  return <div className={`h-px bg-white/[0.06] ${className}`} />;
}
