/**
 * Drawer utilities
 */

interface Drawer {
  id: string;
  title: string;
  content: React.ReactNode;
  position: "left" | "right" | "top" | "bottom";
  size: "sm" | "md" | "lg" | "xl";
  dismissible: boolean;
  onClose?: () => void;
}

class DrawerManager {
  private drawers: Drawer[] = [];
  private listeners: Set<(drawers: Drawer[]) => void> = new Set();

  open(options: Omit<Drawer, "id">): string {
    const id = crypto.randomUUID();
    const drawer: Drawer = {
      ...options,
      id,
    };

    this.drawers.push(drawer);
    this.notify();
    return id;
  }

  close(id: string): void {
    const index = this.drawers.findIndex((d) => d.id === id);
    if (index > -1) {
      const drawer = this.drawers[index];
      drawer.onClose?.();
      this.drawers.splice(index, 1);
      this.notify();
    }
  }

  closeAll(): void {
    this.drawers.forEach((drawer) => drawer.onClose?.());
    this.drawers = [];
    this.notify();
  }

  getActive(): Drawer | undefined {
    return this.drawers[this.drawers.length - 1];
  }

  getAll(): Drawer[] {
    return [...this.drawers];
  }

  hasActive(): boolean {
    return this.drawers.length > 0;
  }

  subscribe(listener: (drawers: Drawer[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getAll());
      } catch (error) {
        console.error("Error in drawer listener:", error);
      }
    });
  }
}

export function createDrawerManager(): DrawerManager {
  return new DrawerManager();
}

export function createDrawer(
  title: string,
  content: React.ReactNode,
  options?: Partial<Omit<Drawer, "id" | "title" | "content">>
): Omit<Drawer, "id"> {
  return {
    title,
    content,
    position: "right",
    size: "md",
    dismissible: true,
    ...options,
  };
}

// Global drawer manager
let globalDrawerManager: DrawerManager | null = null;

export function getGlobalDrawerManager(): DrawerManager {
  if (!globalDrawerManager) {
    globalDrawerManager = createDrawerManager();
  }
  return globalDrawerManager;
}

export function setGlobalDrawerManager(manager: DrawerManager): void {
  globalDrawerManager = manager;
}

// Convenience functions
export function openDrawer(
  title: string,
  content: React.ReactNode,
  options?: Partial<Omit<Drawer, "id" | "title" | "content">>
): string {
  return getGlobalDrawerManager().open({ title, content, position: "right", size: "md", dismissible: true, ...options });
}

export function closeDrawer(id: string): void {
  getGlobalDrawerManager().close(id);
}

export function closeAllDrawers(): void {
  getGlobalDrawerManager().closeAll();
}

export function hasActiveDrawer(): boolean {
  return getGlobalDrawerManager().hasActive();
}

export function getActiveDrawer(): Drawer | undefined {
  return getGlobalDrawerManager().getActive();
}
