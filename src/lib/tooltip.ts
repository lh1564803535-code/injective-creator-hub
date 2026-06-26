/**
 * Tooltip utilities
 */

interface Tooltip {
  id: string;
  trigger: HTMLElement;
  content: string;
  position: "top" | "bottom" | "left" | "right";
  delay: number;
}

class TooltipManager {
  private tooltips: Map<string, Tooltip> = new Map();
  private activeTooltip: string | null = null;
  private timeout: ReturnType<typeof setTimeout> | null = null;

  register(options: Omit<Tooltip, "id">): string {
    const id = crypto.randomUUID();
    const tooltip: Tooltip = {
      ...options,
      id,
    };

    this.tooltips.set(id, tooltip);

    // Add event listeners
    const trigger = options.trigger;
    trigger.addEventListener("mouseenter", () => this.show(id));
    trigger.addEventListener("mouseleave", () => this.hide());
    trigger.addEventListener("focus", () => this.show(id));
    trigger.addEventListener("blur", () => this.hide());

    return id;
  }

  unregister(id: string): void {
    const tooltip = this.tooltips.get(id);
    if (tooltip) {
      const trigger = tooltip.trigger;
      trigger.removeEventListener("mouseenter", () => this.show(id));
      trigger.removeEventListener("mouseleave", () => this.hide());
      trigger.removeEventListener("focus", () => this.show(id));
      trigger.removeEventListener("blur", () => this.hide());
    }
    this.tooltips.delete(id);
  }

  show(id: string): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    const tooltip = this.tooltips.get(id);
    if (!tooltip) return;

    this.timeout = setTimeout(() => {
      this.activeTooltip = id;
    }, tooltip.delay);
  }

  hide(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.activeTooltip = null;
  }

  getActive(): Tooltip | undefined {
    if (!this.activeTooltip) return undefined;
    return this.tooltips.get(this.activeTooltip);
  }

  getAll(): Tooltip[] {
    return Array.from(this.tooltips.values());
  }

  clear(): void {
    this.tooltips.clear();
    this.activeTooltip = null;
  }
}

export function createTooltipManager(): TooltipManager {
  return new TooltipManager();
}

export function createTooltip(
  trigger: HTMLElement,
  content: string,
  options?: Partial<Omit<Tooltip, "id" | "trigger" | "content">>
): Omit<Tooltip, "id"> {
  return {
    trigger,
    content,
    position: "top",
    delay: 200,
    ...options,
  };
}

// Global tooltip manager
let globalTooltipManager: TooltipManager | null = null;

export function getGlobalTooltipManager(): TooltipManager {
  if (!globalTooltipManager) {
    globalTooltipManager = createTooltipManager();
  }
  return globalTooltipManager;
}

export function setGlobalTooltipManager(manager: TooltipManager): void {
  globalTooltipManager = manager;
}

// Convenience functions
export function registerTooltip(
  trigger: HTMLElement,
  content: string,
  options?: Partial<Omit<Tooltip, "id" | "trigger" | "content">>
): string {
  return getGlobalTooltipManager().register({ trigger, content, position: "top", delay: 200, ...options });
}

export function unregisterTooltip(id: string): void {
  getGlobalTooltipManager().unregister(id);
}

export function clearTooltips(): void {
  getGlobalTooltipManager().clear();
}
