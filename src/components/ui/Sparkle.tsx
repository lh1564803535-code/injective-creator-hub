"use client";

import { useEffect, useState } from "react";

interface SparkleProps {
  children: React.ReactNode;
  color?: string;
  count?: number;
  className?: string;
}

export function Sparkle({
  children,
  color = "#f59e0b",
  count = 3,
  className = "",
}: SparkleProps) {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const generateSparkles = () => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
      }));
    };

    setSparkles(generateSparkles());
    const interval = setInterval(() => setSparkles(generateSparkles()), 3000);
    return () => clearInterval(interval);
  }, [count]);

  return (
    <span className={`relative inline-block ${className}`}>
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="sparkle absolute animate-ping"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDelay: `${sparkle.delay}s`,
            color,
            fontSize: "8px",
          }}
        >
          ✦
        </span>
      ))}
      {children}
    </span>
  );
}
