"use client";

import { useEffect, useState } from "react";

/**
 * Returns `true` when the user prefers reduced motion.
 * Listens for real-time changes (e.g., user toggles the OS setting).
 *
 * Usage:
 *   const reduced = useReducedMotion();
 *   if (reduced) return null; // skip confetti
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}
