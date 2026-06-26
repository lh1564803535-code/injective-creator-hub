"use client";

import { useEffect } from "react";
import { Keyboard } from "lucide-react";

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  modifiers?: ("ctrl" | "meta" | "shift" | "alt")[];
}

interface KeyboardShortcutsProps {
  shortcuts: Shortcut[];
}

export function KeyboardShortcuts({ shortcuts }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const modifiersMatch = shortcut.modifiers?.every((mod) => {
          switch (mod) {
            case "ctrl": return e.ctrlKey;
            case "meta": return e.metaKey;
            case "shift": return e.shiftKey;
            case "alt": return e.altKey;
            default: return false;
          }
        }) ?? true;

        if (e.key === shortcut.key && modifiersMatch) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);

  return null;
}

export function ShortcutHint({ shortcut }: { shortcut: string }) {
  return (
    <kbd className="inline-flex items-center gap-1 rounded border border-white/[0.1] bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-gray-500">
      {shortcut}
    </kbd>
  );
}

export function ShortcutList({ shortcuts }: { shortcuts: Array<{ key: string; description: string }> }) {
  return (
    <div className="space-y-2">
      {shortcuts.map((shortcut) => (
        <div key={shortcut.key} className="flex items-center justify-between">
          <span className="text-sm text-gray-400">{shortcut.description}</span>
          <ShortcutHint shortcut={shortcut.key} />
        </div>
      ))}
    </div>
  );
}
