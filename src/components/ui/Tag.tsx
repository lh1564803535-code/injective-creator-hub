"use client";

import { X } from "lucide-react";

// ---------------------------------------------------------------------------
// Color variants
// ---------------------------------------------------------------------------

type TagColor = "green" | "blue" | "purple" | "orange" | "red";

const colorClasses: Record<TagColor, string> = {
  green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  blue: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
};

// ---------------------------------------------------------------------------
// Single Tag
// ---------------------------------------------------------------------------

interface TagProps {
  label: string;
  color?: TagColor;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
}

export function Tag({ label, color = "blue", closable = false, onClose, className = "" }: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${colorClasses[color]} ${className}`}
    >
      {label}
      {closable && (
        <button
          onClick={onClose}
          className="ml-0.5 rounded-full p-0.5 hover:bg-white/10 transition-colors"
          aria-label={`Remove ${label}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Tag Group
// ---------------------------------------------------------------------------

interface TagGroupProps {
  tags: { label: string; color?: TagColor }[];
  closable?: boolean;
  onClose?: (index: number) => void;
  className?: string;
}

export function TagGroup({ tags, closable = false, onClose, className = "" }: TagGroupProps) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((tag, i) => (
        <Tag
          key={`${tag.label}-${i}`}
          label={tag.label}
          color={tag.color}
          closable={closable}
          onClose={() => onClose?.(i)}
        />
      ))}
    </div>
  );
}
