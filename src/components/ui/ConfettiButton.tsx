"use client";

import { useCallback } from "react";

interface ConfettiButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function ConfettiButton({
  children,
  onClick,
  className = "",
  disabled = false,
}: ConfettiButtonProps) {
  const handleClick = useCallback(() => {
    onClick?.();

    // Create confetti particles
    const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];
    const container = document.createElement("div");
    container.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999";
    document.body.appendChild(container);

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      const color = colors[Math.floor(Math.random() * colors.length)];
      const x = Math.random() * window.innerWidth;
      const y = window.innerHeight + 10;
      const angle = Math.random() * Math.PI * 2;
      const velocity = 3 + Math.random() * 4;
      const rotation = Math.random() * 360;

      particle.style.cssText = `
        position:absolute;
        left:${x}px;
        top:${y}px;
        width:8px;
        height:8px;
        background:${color};
        border-radius:${Math.random() > 0.5 ? "50%" : "0"};
        transform:rotate(${rotation}deg);
      `;

      container.appendChild(particle);

      // Animate
      let posY = y;
      let posX = x;
      let velY = -velocity;
      let velX = (Math.random() - 0.5) * 4;
      let rot = rotation;
      let opacity = 1;

      const animate = () => {
        velY += 0.1; // gravity
        posY += velY;
        posX += velX;
        rot += 5;
        opacity -= 0.01;

        particle.style.transform = `translate(${posX - x}px, ${posY - y}px) rotate(${rot}deg)`;
        particle.style.opacity = String(opacity);

        if (opacity > 0 && posY < window.innerHeight + 100) {
          requestAnimationFrame(animate);
        } else {
          particle.remove();
          if (container.children.length === 0) {
            container.remove();
          }
        }
      };

      requestAnimationFrame(animate);
    }
  }, [onClick]);

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
}
