"use client";

import { useState, useEffect, useRef } from "react";
import { DollarSign, Zap } from "lucide-react";

interface ScrollEarningsCounterProps {
  baseAmount?: number;
  maxAmount?: number;
}

function formatUSDC(value: number): string {
  return value.toFixed(4);
}

export function ScrollEarningsCounter({
  baseAmount = 42.5837,
  maxAmount = 42.9999,
}: ScrollEarningsCounterProps) {
  const [earnings, setEarnings] = useState(baseAmount);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const lastScrollRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const velocityRef = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const handleScroll = () => {
      const now = Date.now();
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollY / maxScroll, 1);

      // Calculate scroll velocity
      const timeDelta = now - lastTimeRef.current;
      if (timeDelta > 0) {
        const scrollDelta = Math.abs(scrollY - lastScrollRef.current);
        velocityRef.current = scrollDelta / timeDelta;
        setScrollSpeed(Math.min(velocityRef.current * 100, 100));
      }

      lastTimeRef.current = now;
      lastScrollRef.current = scrollY;

      // Apply velocity bonus to earnings
      const velocityBonus = 1 + velocityRef.current * 2;
      const range = maxAmount - baseAmount;
      const newEarnings = baseAmount + range * scrollProgress * velocityBonus;

      setEarnings(Math.min(newEarnings, maxAmount * 1.5));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible, baseAmount, maxAmount]);

  const speedLabel = scrollSpeed > 50 ? "FAST" : scrollSpeed > 20 ? "STREAMING" : "LIVE";
  const speedColor = scrollSpeed > 50 ? "text-amber-400" : scrollSpeed > 20 ? "text-emerald-400" : "text-emerald-400";

  return (
    <div
      ref={ref}
      className="scroll-earnings-counter flex items-center gap-3 rounded-full border border-amber-500/20 bg-[#1a1a1a] px-5 py-2.5 shadow-lg shadow-amber-500/5 transition-all duration-300"
      style={{
        borderColor: scrollSpeed > 50 ? "rgba(251, 191, 36, 0.4)" : undefined,
      }}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15">
        <DollarSign className="h-4 w-4 text-amber-400" />
      </div>
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
          You Scroll, We Stream
        </p>
        <p className="font-mono text-lg font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
          ${formatUSDC(earnings)}
        </p>
      </div>
      <div className="ml-2 flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-1">
          {scrollSpeed > 50 && <Zap className="h-3 w-3 text-amber-400" />}
          <span className={`h-1.5 w-1.5 rounded-full bg-current animate-pulse ${speedColor}`} />
        </div>
        <span className={`text-[9px] font-medium uppercase ${speedColor}`}>
          {speedLabel}
        </span>
      </div>
    </div>
  );
}
