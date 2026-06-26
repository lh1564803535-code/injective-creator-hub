"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface Action {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions: Action[];
  mainIcon?: React.ReactNode;
  className?: string;
}

export function FloatingActionButton({
  actions,
  mainIcon = <Plus className="h-6 w-6" />,
  className = "",
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`fixed bottom-24 right-6 z-40 flex flex-col items-end gap-3 ${className}`}>
      {/* Sub actions */}
      {isOpen &&
        actions.map((action, index) => (
          <button
            key={index}
            onClick={() => {
              action.onClick();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 rounded-full bg-[#1a1a1a] px-4 py-2 text-sm text-white shadow-lg transition hover:bg-white/[0.06]"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <span className={`flex h-8 w-8 items-center justify-center rounded-full ${action.color || "bg-cyan-500/15"}`}>
              {action.icon}
            </span>
            <span className="text-xs">{action.label}</span>
          </button>
        ))}

      {/* Main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 transition-transform hover:scale-110"
        style={{
          transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease-out",
        }}
      >
        {isOpen ? <X className="h-6 w-6" /> : mainIcon}
      </button>
    </div>
  );
}
