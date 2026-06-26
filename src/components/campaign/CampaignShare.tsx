"use client";

import { useState, useCallback } from "react";
import { Twitter, Link2, Check, QrCode, X } from "lucide-react";

function QRCodeSVG({ url, size = 160 }: { url: string; size?: number }) {
  const modules = generateQRModules(url);
  const count = modules.length;
  const cellSize = size / count;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {modules.map((row, y) =>
        row.map((cell, x) =>
          cell ? (
            <rect
              key={`${x}-${y}`}
              x={x * cellSize}
              y={y * cellSize}
              width={cellSize}
              height={cellSize}
              fill="white"
            />
          ) : null
        )
      )}
    </svg>
  );
}

function generateQRModules(data: string): boolean[][] {
  const size = 21;
  const grid: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );

  const hash = simpleHash(data);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (isFinderPattern(x, y, size) || isAlignmentPattern(x, y)) {
        grid[y][x] = isFinderFilled(x, y, size) || isAlignmentFilled(x, y);
      } else {
        grid[y][x] = ((hash >> ((y * size + x) % 31)) & 1) === 1;
      }
    }
  }
  return grid;
}

function simpleHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function isFinderPattern(x: number, y: number, size: number): boolean {
  return (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
}

function isFinderFilled(x: number, y: number, size: number): boolean {
  const lx = x < 7 ? x : x - (size - 7);
  const ly = y < 7 ? y : y - (size - 7);
  return lx === 0 || lx === 6 || ly === 0 || ly === 6 || (lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4);
}

function isAlignmentPattern(x: number, y: number): boolean {
  return x >= 8 && x <= 12 && y >= 8 && y <= 12;
}

function isAlignmentFilled(x: number, y: number): boolean {
  return x === 8 || x === 12 || y === 8 || y === 12 || (x === 10 && y === 10);
}

export function CampaignShare({
  campaignId,
  campaignTitle = "Campaign",
  baseUrl = "https://injective-creator-hub.com",
}: {
  campaignId: string;
  campaignTitle?: string;
  baseUrl?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const shareUrl = `${baseUrl}/campaign/${campaignId}`;
  const tweetText = encodeURIComponent(
    `Check out "${campaignTitle}" on @Injective Creator Hub! ${shareUrl}`
  );

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Share Campaign</h3>
        <span className="text-xs text-gray-600">#{campaignId.slice(0, 8)}</span>
      </div>

      <div className="space-y-2.5">
        <a
          href={`https://twitter.com/intent/tweet?text=${tweetText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-3 text-gray-400 hover:text-cyan-400 hover:bg-white/[0.06] transition"
        >
          <Twitter className="h-4 w-4" />
          <span className="text-sm">Share on Twitter</span>
        </a>

        <button
          onClick={handleCopy}
          className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-3 text-gray-400 hover:text-white hover:bg-white/[0.06] transition w-full"
        >
          {copied ? (
            <Check className="h-4 w-4 text-emerald-400" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
          <span className="text-sm">{copied ? "Copied!" : "Copy Link"}</span>
        </button>

        <button
          onClick={() => setShowQR((v) => !v)}
          className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-3 text-gray-400 hover:text-white hover:bg-white/[0.06] transition w-full"
        >
          <QrCode className="h-4 w-4" />
          <span className="text-sm">{showQR ? "Hide QR Code" : "Show QR Code"}</span>
        </button>
      </div>

      {showQR && (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-xl bg-white p-4">
          <QRCodeSVG url={shareUrl} size={160} />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowQR(false)}
              className="text-xs text-gray-500 hover:text-gray-800 transition flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
