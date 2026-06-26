"use client";

interface DividerProps {
  label?: string;
  orientation?: "horizontal" | "vertical";
}

export function Divider({ label, orientation = "horizontal" }: DividerProps) {
  if (orientation === "vertical") {
    return <div className="h-full w-px bg-white/[0.06]" />;
  }

  if (label) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-xs text-gray-500">{label}</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>
    );
  }

  return <div className="h-px bg-white/[0.06]" />;
}
