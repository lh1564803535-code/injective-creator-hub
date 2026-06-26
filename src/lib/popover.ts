/**
 * Popover utilities
 */

interface Popover {
  id: string;
  trigger: HTMLElement;
  content: React.ReactNode;
  position: "top" | "bottom" | "left" | "right";
  dismissible: boolean;
  onClose?: () => void;
}

class PopoverManager {
  private popovers: Map<string, Popover> = new Map();
  private listeners: Set<(popovers: Popover[]) => void> = new Set();

  open(options: Omit<Popover, "id">): string {
    const id = crypto.randomUUID();
    const popover: Popover = {
      ...options,
      id,
    };

    this.popovers.set(id, popover);
    this.notify();
    return id;
  }

  close(id: string): void {
    const popover = this.popovers.get(id);
    if (popover) {
      popover.onClose?.();
      this.popovers.delete(id);
      this.notify();
    }
  }

  closeAll(): void {
    this.popovers.forEach((popover) => popover.onClose?.());
    this.popovers.clear();
    this.notify();
  }

  getActive(): Popover | undefined {
    return Array.from(this.popovers.values())[0];
  }

  getAll(): Popover[] {
    return Array.from(this.popovers.values());
  }

  hasActive(): boolean {
    return this.popovers.size > 0;
  }

  subscribe(listener: (popovers: Popover[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getAll());
      } catch (error) {
        console.error("Error in popover listener:", error);
      }
    });
  }
}

export function createPopoverManager(): PopoverManager {
  return new PopoverManager();
}

export function createPopover(
  trigger: HTMLElement,
  content: React.ReactNode,
  options?: Partial<Omit<Popover, "id" | "trigger" | "content">>
): Omit<Popover, "id"> {
  return {
    trigger,
    content,
    position: "bottom",
    dismissible: true,
    ...options,
  };
}

// Global popover manager
let globalPopoverManager: PopoverManager | null = null;

export function getGlobalPopoverManager(): PopoverManager {
  if (!globalPopoverManager) {
    globalPopoverManager = createPopoverManager();
  }
  return globalPopoverManager;
}

export function setGlobalPopoverManager(manager: PopoverManager): void {
  globalPopoverManager = manager;
}

// Convenience functions
export function openPopover(
  trigger: HTMLElement,
  content: React.ReactNode,
  options?: Partial<Omit<Popover, "id" | "trigger" | "content">>
): string {
  return getGlobalPopoverManager().open({ trigger, content, position: "bottom", dismissible: true, ...options });
}

export function closePopover(id: string): void {
  getGlobalPopoverManager().close(id);
}

export function closeAllPopovers(): void {
  getGlobalPopoverManager().closeAll();
}

export function hasActivePopover(): boolean {
  return getGlobalPopoverManager().hasActive();
}
