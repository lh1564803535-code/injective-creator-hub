/**
 * Context Menu utilities
 */

interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  divider?: boolean;
  children?: ContextMenuItem[];
  onClick?: () => void;
}

interface ContextMenu {
  id: string;
  items: ContextMenuItem[];
  x: number;
  y: number;
  onClose?: () => void;
}

class ContextMenuManager {
  private menus: Map<string, ContextMenu> = new Map();
  private listeners: Set<(menus: ContextMenu[]) => void> = new Set();

  show(options: Omit<ContextMenu, "id">): string {
    const id = crypto.randomUUID();
    const menu: ContextMenu = {
      ...options,
      id,
    };

    this.menus.set(id, menu);
    this.notify();

    // Close on outside click
    setTimeout(() => {
      const closeHandler = () => {
        this.close(id);
        document.removeEventListener("click", closeHandler);
      };
      document.addEventListener("click", closeHandler);
    }, 0);

    return id;
  }

  close(id: string): void {
    const menu = this.menus.get(id);
    if (menu) {
      menu.onClose?.();
      this.menus.delete(id);
      this.notify();
    }
  }

  closeAll(): void {
    this.menus.forEach((menu) => menu.onClose?.());
    this.menus.clear();
    this.notify();
  }

  getActive(): ContextMenu | undefined {
    return Array.from(this.menus.values())[0];
  }

  getAll(): ContextMenu[] {
    return Array.from(this.menus.values());
  }

  hasActive(): boolean {
    return this.menus.size > 0;
  }

  subscribe(listener: (menus: ContextMenu[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getAll());
      } catch (error) {
        console.error("Error in context menu listener:", error);
      }
    });
  }
}

export function createContextMenuManager(): ContextMenuManager {
  return new ContextMenuManager();
}

export function createContextMenu(
  items: ContextMenuItem[],
  x: number,
  y: number,
  onClose?: () => void
): Omit<ContextMenu, "id"> {
  return { items, x, y, onClose };
}

export function createContextMenuItem(
  label: string,
  options?: Partial<Omit<ContextMenuItem, "id" | "label">>
): ContextMenuItem {
  return {
    id: crypto.randomUUID(),
    label,
    ...options,
  };
}

export function createContextMenuDivider(): ContextMenuItem {
  return {
    id: crypto.randomUUID(),
    label: "",
    divider: true,
  };
}

// Global context menu manager
let globalContextMenuManager: ContextMenuManager | null = null;

export function getGlobalContextMenuManager(): ContextMenuManager {
  if (!globalContextMenuManager) {
    globalContextMenuManager = createContextMenuManager();
  }
  return globalContextMenuManager;
}

export function setGlobalContextMenuManager(manager: ContextMenuManager): void {
  globalContextMenuManager = manager;
}

// Convenience functions
export function showContextMenu(
  items: ContextMenuItem[],
  x: number,
  y: number,
  onClose?: () => void
): string {
  return getGlobalContextMenuManager().show({ items, x, y, onClose });
}

export function closeContextMenu(id: string): void {
  getGlobalContextMenuManager().close(id);
}

export function closeAllContextMenus(): void {
  getGlobalContextMenuManager().closeAll();
}

export function hasActiveContextMenu(): boolean {
  return getGlobalContextMenuManager().hasActive();
}

// Hook for context menu
export function useContextMenu(items: ContextMenuItem[]) {
  const show = (e: React.MouseEvent) => {
    e.preventDefault();
    showContextMenu(items, e.clientX, e.clientY);
  };

  return { show };
}
