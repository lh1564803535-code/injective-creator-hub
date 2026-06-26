"use client";

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  width?: number;
  height?: number;
}

export function ImageWithFallback({
  src,
  alt,
  fallback,
  className = "",
  width,
  height,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-white/[0.04] ${className}`}
        style={{ width, height }}
      >
        {fallback ? (
          <img src={fallback} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-8 w-8 text-gray-600" />
        )}
      </div>
    );
  }

  return (
    <div className="relative" style={{ width, height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/[0.04]">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-600 border-t-transparent" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loading ? "opacity-0" : "opacity-100"} transition-opacity`}
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
        width={width}
        height={height}
      />
    </div>
  );
}
