"use client";

import { useEffect, useState } from "react";
import { CheckCircle, PartyPopper } from "lucide-react";

interface SuccessAnimationProps {
  message: string;
  submessage?: string;
  onComplete?: () => void;
  duration?: number;
}

export function SuccessAnimation({
  message,
  submessage,
  onComplete,
  duration = 3000,
}: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    setIsVisible(true);

    // Generate confetti particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5,
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative flex flex-col items-center rounded-2xl border border-white/[0.08] bg-[#1a1a1a] p-8 shadow-2xl">
        {/* Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="success-particle absolute h-2 w-2 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              backgroundColor: ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"][
                particle.id % 5
              ],
            }}
          />
        ))}

        {/* Check icon */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle className="h-10 w-10 text-emerald-400" />
        </div>

        {/* Message */}
        <h3 className="mb-2 text-xl font-bold text-white">{message}</h3>
        {submessage && (
          <p className="text-sm text-gray-400">{submessage}</p>
        )}

        {/* Confetti icon */}
        <div className="mt-4">
          <PartyPopper className="h-6 w-6 text-amber-400" />
        </div>
      </div>
    </div>
  );
}
