/**
 * Animation utilities
 */

export function animate(
  element: HTMLElement,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions
): Animation {
  return element.animate(keyframes, options);
}

export function fadeIn(
  element: HTMLElement,
  duration: number = 300
): Animation {
  return animate(
    element,
    [
      { opacity: 0 },
      { opacity: 1 },
    ],
    { duration, fill: "forwards" }
  );
}

export function fadeOut(
  element: HTMLElement,
  duration: number = 300
): Animation {
  return animate(
    element,
    [
      { opacity: 1 },
      { opacity: 0 },
    ],
    { duration, fill: "forwards" }
  );
}

export function slideIn(
  element: HTMLElement,
  direction: "up" | "down" | "left" | "right" = "up",
  duration: number = 300
): Animation {
  const transforms: Record<string, string[]> = {
    up: ["translateY(20px)", "translateY(0)"],
    down: ["translateY(-20px)", "translateY(0)"],
    left: ["translateX(20px)", "translateX(0)"],
    right: ["translateX(-20px)", "translateX(0)"],
  };

  return animate(
    element,
    [
      { opacity: 0, transform: transforms[direction][0] },
      { opacity: 1, transform: transforms[direction][1] },
    ],
    { duration, fill: "forwards" }
  );
}

export function slideOut(
  element: HTMLElement,
  direction: "up" | "down" | "left" | "right" = "up",
  duration: number = 300
): Animation {
  const transforms: Record<string, string[]> = {
    up: ["translateY(0)", "translateY(-20px)"],
    down: ["translateY(0)", "translateY(20px)"],
    left: ["translateX(0)", "translateX(-20px)"],
    right: ["translateX(0)", "translateX(20px)"],
  };

  return animate(
    element,
    [
      { opacity: 1, transform: transforms[direction][0] },
      { opacity: 0, transform: transforms[direction][1] },
    ],
    { duration, fill: "forwards" }
  );
}

export function scaleIn(
  element: HTMLElement,
  duration: number = 300
): Animation {
  return animate(
    element,
    [
      { opacity: 0, transform: "scale(0.9)" },
      { opacity: 1, transform: "scale(1)" },
    ],
    { duration, fill: "forwards" }
  );
}

export function scaleOut(
  element: HTMLElement,
  duration: number = 300
): Animation {
  return animate(
    element,
    [
      { opacity: 1, transform: "scale(1)" },
      { opacity: 0, transform: "scale(0.9)" },
    ],
    { duration, fill: "forwards" }
  );
}

export function bounce(
  element: HTMLElement,
  duration: number = 600
): Animation {
  return animate(
    element,
    [
      { transform: "translateY(0)" },
      { transform: "translateY(-10px)" },
      { transform: "translateY(0)" },
      { transform: "translateY(-5px)" },
      { transform: "translateY(0)" },
    ],
    { duration, iterations: 1 }
  );
}

export function shake(
  element: HTMLElement,
  duration: number = 500
): Animation {
  return animate(
    element,
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-5px)" },
      { transform: "translateX(5px)" },
      { transform: "translateX(-5px)" },
      { transform: "translateX(5px)" },
      { transform: "translateX(0)" },
    ],
    { duration, iterations: 1 }
  );
}

export function pulse(
  element: HTMLElement,
  duration: number = 1000
): Animation {
  return animate(
    element,
    [
      { transform: "scale(1)" },
      { transform: "scale(1.05)" },
      { transform: "scale(1)" },
    ],
    { duration, iterations: Infinity }
  );
}

export function spin(
  element: HTMLElement,
  duration: number = 1000
): Animation {
  return animate(
    element,
    [
      { transform: "rotate(0deg)" },
      { transform: "rotate(360deg)" },
    ],
    { duration, iterations: Infinity }
  );
}

export function waitForAnimation(animation: Animation): Promise<void> {
  return new Promise((resolve) => {
    animation.addEventListener("finish", () => resolve());
  });
}

export function cancelAnimation(animation: Animation): void {
  animation.cancel();
}
