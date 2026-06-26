"use client";

import { useState, useEffect, useRef } from "react";
import { DollarSign } from "lucide-react";

interface ScrollEarningsCounterProps {
  /** Base earnings amount */
  baseAmount?: number;
  /** Max earnings when fully scrolled */
  maxAmount?: number;
}

function formatUSDC(value: number): string {
  return value.toFixed(4);
}

/**
 * Superfluid-inspired "YOU SCROLL, WE STREAM" component
 * Earnings increase as user scrolls through the page
 */
export function ScrollEarningsCounter({
  baseAmount = 42.5837,
  maxAmount = 42.9999,
}: ScrollEarningsCounterProps) {
  const [earnings, setEarnings] = useState(baseAmount);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollY / maxScroll, 1);

      // Calculate earnings based on scroll position
      const range = maxAmount - baseAmount;
      const newEarnings = baseAmount + range * scrollProgress;

      // Only update if scroll changed significantly (debounce)
      if (Math.abs(scrollY - lastScrollRef.current) > 5) {
        setEarnings(newEarnings);
        lastScrollRef.current = scrollY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible, baseAmount, maxAmount]);

  return (
    <div
      ref={ref}
      className="scroll-earnings-counter flex items-center gap-3 rounded-full border border-amber-500/20 bg-[#1a1a1a] px-5 py-2.5 shadow-lg shadow-amber-500/5"
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
      <div className="ml-2 flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] text-emerald-400">LIVE</span>
      </div>
    </div>
  );
}
