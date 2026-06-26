"use client";

import { useMemo } from "react";

interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity: number;
  hue: number;
}

/**
 * Lightweight CSS-only floating particle background.
 * No canvas / JS animation loop — pure CSS keyframes for performance.
 */
export function FloatingParticles({ count = 30 }: { count?: number }) {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        size: 2 + Math.random() * 4,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * -20,
        opacity: 0.15 + Math.random() * 0.25,
        hue: Math.random() > 0.5 ? 180 : 260, // cyan or purple
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full will-change-transform"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: `hsla(${p.hue}, 70%, 60%, ${p.opacity})`,
            animation: `float-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            filter: `blur(${p.size > 4 ? 1 : 0}px)`,
          }}
        />
      ))}
    </div>
  );
}
