/**
 * Accessibility utilities
 */

export function isReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isHighContrast(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-contrast: high)").matches;
}

export function isDarkMode(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function isLightMode(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: light)").matches;
}

export function addReducedMotionListener(handler: (reduced: boolean) => void): () => void {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const wrappedHandler = (e: MediaQueryListEvent) => handler(e.matches);
  mediaQuery.addEventListener("change", wrappedHandler);
  return () => mediaQuery.removeEventListener("change", wrappedHandler);
}

export function addDarkModeListener(handler: (dark: boolean) => void): () => void {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const wrappedHandler = (e: MediaQueryListEvent) => handler(e.matches);
  mediaQuery.addEventListener("change", wrappedHandler);
  return () => mediaQuery.removeEventListener("change", wrappedHandler);
}

export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  element.addEventListener("keydown", handleKeyDown);
  firstFocusable?.focus();

  return () => {
    element.removeEventListener("keydown", handleKeyDown);
  };
}

export function announceToScreenReader(message: string, priority: "polite" | "assertive" = "polite"): void {
  const announcer = document.createElement("div");
  announcer.setAttribute("aria-live", priority);
  announcer.setAttribute("aria-atomic", "true");
  announcer.className = "sr-only";
  document.body.appendChild(announcer);

  setTimeout(() => {
    announcer.textContent = message;
  }, 100);

  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
}

export function getAriaLabel(element: HTMLElement): string | null {
  return element.getAttribute("aria-label");
}

export function setAriaLabel(element: HTMLElement, label: string): void {
  element.setAttribute("aria-label", label);
}

export function getAriaDescription(element: HTMLElement): string | null {
  return element.getAttribute("aria-describedby");
}

export function setAriaDescription(element: HTMLElement, descriptionId: string): void {
  element.setAttribute("aria-describedby", descriptionId);
}

export function isFocusable(element: HTMLElement): boolean {
  const focusableSelectors = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ];

  return focusableSelectors.some((selector) => element.matches(selector));
}

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ];

  return Array.from(container.querySelectorAll(focusableSelectors.join(", ")));
}
