"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

interface ShareButtonProps {
  url: string;
  title?: string;
  className?: string;
}

export function ShareButton({ url, title, className = "" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-gray-400 transition hover:bg-white/[0.08] hover:text-white ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5" />
          <span>Share</span>
        </>
      )}
    </button>
  );
}
