"use client";

import { useRef, useState, useEffect } from "react";

interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  maxHeight?: string;
}

export function ScrollArea({
  children,
  className = "",
  maxHeight = "400px",
}: ScrollAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTopShadow, setShowTopShadow] = useState(false);
  const [showBottomShadow, setShowBottomShadow] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setShowTopShadow(container.scrollTop > 0);
      setShowBottomShadow(
        container.scrollTop < container.scrollHeight - container.clientHeight - 1
      );
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {showTopShadow && (
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-8 bg-gradient-to-b from-[#1a1a1a] to-transparent" />
      )}

      <div
        ref={containerRef}
        className="overflow-y-auto"
        style={{ maxHeight }}
      >
        {children}
      </div>

      {showBottomShadow && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-8 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
      )}
    </div>
  );
}
