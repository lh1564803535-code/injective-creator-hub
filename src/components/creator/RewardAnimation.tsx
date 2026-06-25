"use client";

import { useEffect, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { Check, Sparkles } from "lucide-react";

interface RewardAnimationProps {
  amount: number;
  creatorAddress: string;
  onComplete?: () => void;
}

export function RewardAnimation({
  amount,
  creatorAddress,
  onComplete,
}: RewardAnimationProps) {
  const [currentAmount, setCurrentAmount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showParticles, setShowParticles] = useState(true);

  // Animate counter
  const animateCounter = useCallback((target: number, duration: number = 2000) => {
    const start = performance.now();
    function update(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCurrentAmount(target * eased);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setIsComplete(true);
        onComplete?.();
      }
    }
    requestAnimationFrame(update);
  }, [onComplete]);

  // Trigger confetti
  const triggerConfetti = useCallback(() => {
    const count = 200;
    const defaults = { origin: { y: 0.7 }, zIndex: 9999 };

    function fire(particleRatio: number, opts: Record<string, unknown>) {
      confetti({
        ...defaults,
        particleCount: Math.floor(count * particleRatio),
        ...opts,
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  // Start animation
  useEffect(() => {
    triggerConfetti();
    animateCounter(amount);

    // Hide particles after animation
    const timer = setTimeout(() => setShowParticles(false), 3000);
    return () => clearTimeout(timer);
  }, [amount, animateCounter, triggerConfetti]);

  // Generate random particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    startX: `${Math.random() * 100}vw`,
    startY: `${Math.random() * 100}vh`,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 1,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Golden Particles */}
      {showParticles &&
        particles.map((particle) => (
          <div
            key={particle.id}
            className="golden-particle"
            style={{
              left: particle.startX,
              top: particle.startY,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}

      {/* Main Content */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Sparkle Icon */}
        <div className="animate-bounce">
          <Sparkles className="h-12 w-12 text-amber-400" />
        </div>

        {/* Amount Display */}
        <div className="text-center">
          <p className="mb-2 text-lg text-gray-400">Reward Settled</p>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-bold tabular-nums text-white">
              {currentAmount.toFixed(2)}
            </span>
            <span className="text-2xl font-semibold text-amber-400">USDC</span>
          </div>
        </div>

        {/* Creator Address */}
        <div className="rounded-full bg-white/[0.06] px-4 py-2">
          <p className="font-mono text-sm text-gray-300">
            {creatorAddress.slice(0, 6)}...{creatorAddress.slice(-4)}
          </p>
        </div>

        {/* Completion Status */}
        {isComplete && (
          <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-6 py-3 text-emerald-400">
            <Check className="h-5 w-5" />
            <span className="font-medium">Settlement Complete</span>
          </div>
        )}

        {/* Animated Ring */}
        <div className="absolute -inset-32 -z-10">
          <div className="h-full w-full animate-spin rounded-full border-2 border-dashed border-amber-500/20" />
        </div>
      </div>
    </div>
  );
}

// Trigger confetti function (can be used independently)
export function triggerSettleConfetti() {
  const count = 200;
  const defaults = { origin: { y: 0.7 }, zIndex: 9999 };

  function fire(particleRatio: number, opts: Record<string, unknown>) {
    confetti({
      ...defaults,
      particleCount: Math.floor(count * particleRatio),
      ...opts,
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}
