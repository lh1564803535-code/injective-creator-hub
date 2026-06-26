"use client";

import { useEffect, useState } from "react";

interface ScrollProgressProps {
  color?: string;
  height?: number;
  className?: string;
}

export function ScrollProgress({
  color = "#22c55e",
  height = 3,
  className = "",
}: ScrollProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed left-0 right-0 top-0 z-[60] ${className}`}
      style={{ height }}
    >
      <div
        className="h-full transition-[width] duration-100"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
        }}
      />
    </div>
  );
}
