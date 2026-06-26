"use client";

import { useEffect, useRef } from "react";

interface QRCodeProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  className?: string;
}

export function QRCode({
  value,
  size = 128,
  bgColor = "#1a1a1a",
  fgColor = "#ffffff",
  className = "",
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Simple QR-like visualization (not a real QR encoder)
    // In production, use a proper QR code library
    const moduleCount = 25;
    const moduleSize = size / moduleCount;

    canvas.width = size;
    canvas.height = size;

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    // Generate pattern from value hash
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      const char = value.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    // Draw modules
    ctx.fillStyle = fgColor;
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        // Position detection patterns (corners)
        const isCornerPattern =
          (row < 7 && col < 7) ||
          (row < 7 && col >= moduleCount - 7) ||
          (row >= moduleCount - 7 && col < 7);

        if (isCornerPattern) {
          // Draw corner patterns
          const inOuterRing =
            row === 0 || row === 6 || col === 0 || col === 6 ||
            (row >= moduleCount - 7 && (row === moduleCount - 7 || row === moduleCount - 1)) ||
            (col >= moduleCount - 7 && (col === moduleCount - 7 || col === moduleCount - 1));

          const inInnerRing =
            (row >= 2 && row <= 4 && col >= 2 && col <= 4) ||
            (row >= 2 && row <= 4 && col >= moduleCount - 5 && col <= moduleCount - 3) ||
            (row >= moduleCount - 5 && row <= moduleCount - 3 && col >= 2 && col <= 4);

          if (inOuterRing || inInnerRing) {
            ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
          }
        } else {
          // Data modules - pseudo-random based on value
          const seed = (hash + row * moduleCount + col) & 0xffff;
          if (seed % 3 !== 0) {
            ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
          }
        }
      }
    }
  }, [value, size, bgColor, fgColor]);

  return (
    <div className={`inline-block ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="rounded-lg"
      />
    </div>
  );
}
