"use client";

import { useEffect, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { Check, Sparkles, PartyPopper } from "lucide-react";

interface RewardAnimationProps {
  amount: number;
  creatorAddress: string;
  onComplete?: () => void;
  onClaim?: () => void;
}

export function RewardAnimation({
  amount,
  creatorAddress,
  onComplete,
  onClaim,
}: RewardAnimationProps) {
  const [currentAmount, setCurrentAmount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showParticles, setShowParticles] = useState(true);

  const animateCounter = useCallback((target: number, duration: number = 2000) => {
    const start = performance.now();
    function update(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
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

  // Dramatic multi-burst confetti with star shapes
  const triggerConfetti = useCallback(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const burst = (originX: number, originY: number, opts: Record<string, unknown>) => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x: originX, y: originY },
        zIndex: 9999,
        colors: ["#fbbf24", "#f59e0b", "#22c55e", "#06b6d4", "#8b5cf6", "#ec4899"],
        shapes: ["star", "circle"],
        disableForReducedMotion: true,
        ...opts,
      });
    };

    if (reducedMotion) {
      // Single gentle burst for reduced-motion users
      burst(0.5, 0.5, { particleCount: 30, spread: 50, startVelocity: 15 });
      return;
    }

    // Burst 1: center stars
    burst(0.5, 0.6, { startVelocity: 45, spread: 90, scalar: 1.1 });
    // Burst 2: left cannon
    setTimeout(() => burst(0, 0.7, { startVelocity: 55, spread: 50, angle: 60, scalar: 0.9 }), 200);
    // Burst 3: right cannon
    setTimeout(() => burst(1, 0.7, { startVelocity: 55, spread: 50, angle: 120, scalar: 0.9 }), 200);
    // Burst 4: top center
    setTimeout(() => burst(0.5, 0.3, { startVelocity: 50, spread: 120, decay: 0.9, scalar: 1.3, shapes: ["star"] }), 600);
    // Burst 5: delayed dramatic center — large slow-falling stars
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 140,
        startVelocity: 25,
        origin: { x: 0.5, y: 0.5 },
        zIndex: 9999,
        colors: ["#fbbf24", "#f59e0b", "#d97706", "#fcd34d"],
        shapes: ["star"],
        gravity: 0.5,
        scalar: 1.4,
        drift: 0,
        ticks: 250,
        disableForReducedMotion: true,
      });
    }, 1000);
  }, []);

  useEffect(() => {
    triggerConfetti();
    animateCounter(amount);
    const timer = setTimeout(() => setShowParticles(false), 3500);
    return () => clearTimeout(timer);
  }, [amount, animateCounter, triggerConfetti]);

  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    startX: `${Math.random() * 100}vw`,
    startY: `${Math.random() * 100}vh`,
    delay: Math.random() * 0.8,
    duration: 0.8 + Math.random() * 1.2,
    size: 4 + Math.random() * 8,
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
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
          />
        ))}

      {/* Main Content */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Sparkle Icon */}
        <div className="animate-bounce">
          <Sparkles className="h-12 w-12 text-amber-400" />
        </div>

        {/* Amount Display with Golden Glow */}
        <div className="text-center">
          <p className="mb-2 text-lg text-gray-400">Reward Settled</p>
          <div className="animate-golden-glow flex items-baseline justify-center gap-2">
            <span className="text-6xl font-bold tabular-nums text-amber-300">
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
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-6 py-3 text-emerald-400">
              <Check className="h-5 w-5" />
              <span className="font-medium">Settlement Complete</span>
            </div>

            {/* Claim Reward Button */}
            {onClaim && (
              <button
                onClick={onClaim}
                className="btn-glow flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 px-8 py-3 font-bold text-black shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40"
              >
                <PartyPopper className="h-5 w-5" />
                Claim Reward
              </button>
            )}
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

export function triggerSettleConfetti() {
  const burst = (originX: number, originY: number, opts: Record<string, unknown>) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: originX, y: originY },
      zIndex: 9999,
      colors: ["#fbbf24", "#f59e0b", "#22c55e", "#06b6d4"],
      shapes: ["star", "circle"],
      disableForReducedMotion: true,
      ...opts,
    });
  };

  burst(0.5, 0.6, { startVelocity: 45, spread: 90, scalar: 1.1 });
  setTimeout(() => burst(0, 0.7, { startVelocity: 55, spread: 50, angle: 60 }), 200);
  setTimeout(() => burst(1, 0.7, { startVelocity: 55, spread: 50, angle: 120 }), 200);
  setTimeout(() => burst(0.5, 0.3, { startVelocity: 50, spread: 120, shapes: ["star"], scalar: 1.3 }), 600);
}
