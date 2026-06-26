/**
 * Menu utilities
 */

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  divider?: boolean;
  children?: MenuItem[];
  onClick?: () => void;
}

class MenuManager {
  private menus: Map<string, MenuItem[]> = new Map();
  private activeMenu: string | null = null;
  private listeners: Set<(activeId: string | null) => void> = new Set();

  register(id: string, items: MenuItem[]): void {
    this.menus.set(id, items);
  }

  unregister(id: string): void {
    this.menus.delete(id);
    if (this.activeMenu === id) {
      this.activeMenu = null;
      this.notify();
    }
  }

  open(id: string): void {
    this.activeMenu = id;
    this.notify();
  }

  close(): void {
    this.activeMenu = null;
    this.notify();
  }

  toggle(id: string): void {
    if (this.activeMenu === id) {
      this.close();
    } else {
      this.open(id);
    }
  }

  getActive(): MenuItem[] | undefined {
    if (!this.activeMenu) return undefined;
    return this.menus.get(this.activeMenu);
  }

  isActive(id: string): boolean {
    return this.activeMenu === id;
  }

  getItems(id: string): MenuItem[] | undefined {
    return this.menus.get(id);
  }

  subscribe(listener: (activeId: string | null) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.activeMenu);
      } catch (error) {
        console.error("Error in menu listener:", error);
      }
    });
  }
}

export function createMenuManager(): MenuManager {
  return new MenuManager();
}

export function createMenuItem(
  label: string,
  options?: Partial<Omit<MenuItem, "id" | "label">>
): MenuItem {
  return {
    id: crypto.randomUUID(),
    label,
    ...options,
  };
}

export function createMenuDivider(): MenuItem {
  return {
    id: crypto.randomUUID(),
    label: "",
    divider: true,
  };
}

// Global menu manager
let globalMenuManager: MenuManager | null = null;

export function getGlobalMenuManager(): MenuManager {
  if (!globalMenuManager) {
    globalMenuManager = createMenuManager();
  }
  return globalMenuManager;
}

export function setGlobalMenuManager(manager: MenuManager): void {
  globalMenuManager = manager;
}

// Convenience functions
export function registerMenu(id: string, items: MenuItem[]): void {
  getGlobalMenuManager().register(id, items);
}

export function unregisterMenu(id: string): void {
  getGlobalMenuManager().unregister(id);
}

export function openMenu(id: string): void {
  getGlobalMenuManager().open(id);
}

export function closeMenu(): void {
  getGlobalMenuManager().close();
}

export function toggleMenu(id: string): void {
  getGlobalMenuManager().toggle(id);
}

export function isMenuActive(id: string): boolean {
  return getGlobalMenuManager().isActive(id);
}
