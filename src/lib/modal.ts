/**
 * Modal utilities
 */

interface Modal {
  id: string;
  title: string;
  content: React.ReactNode;
  size: "sm" | "md" | "lg" | "xl" | "full";
  dismissible: boolean;
  onClose?: () => void;
}

class ModalManager {
  private modals: Modal[] = [];
  private listeners: Set<(modals: Modal[]) => void> = new Set();

  open(options: Omit<Modal, "id">): string {
    const id = crypto.randomUUID();
    const modal: Modal = {
      ...options,
      id,
    };

    this.modals.push(modal);
    this.notify();
    return id;
  }

  close(id: string): void {
    const index = this.modals.findIndex((m) => m.id === id);
    if (index > -1) {
      const modal = this.modals[index];
      modal.onClose?.();
      this.modals.splice(index, 1);
      this.notify();
    }
  }

  closeAll(): void {
    this.modals.forEach((modal) => modal.onClose?.());
    this.modals = [];
    this.notify();
  }

  getActive(): Modal | undefined {
    return this.modals[this.modals.length - 1];
  }

  getAll(): Modal[] {
    return [...this.modals];
  }

  hasActive(): boolean {
    return this.modals.length > 0;
  }

  subscribe(listener: (modals: Modal[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getAll());
      } catch (error) {
        console.error("Error in modal listener:", error);
      }
    });
  }
}

export function createModalManager(): ModalManager {
  return new ModalManager();
}

export function createModal(
  title: string,
  content: React.ReactNode,
  options?: Partial<Omit<Modal, "id" | "title" | "content">>
): Omit<Modal, "id"> {
  return {
    title,
    content,
    size: "md",
    dismissible: true,
    ...options,
  };
}

// Global modal manager
let globalModalManager: ModalManager | null = null;

export function getGlobalModalManager(): ModalManager {
  if (!globalModalManager) {
    globalModalManager = createModalManager();
  }
  return globalModalManager;
}

export function setGlobalModalManager(manager: ModalManager): void {
  globalModalManager = manager;
}

// Convenience functions
export function openModal(
  title: string,
  content: React.ReactNode,
  options?: Partial<Omit<Modal, "id" | "title" | "content">>
): string {
  return getGlobalModalManager().open({ title, content, size: "md", dismissible: true, ...options });
}

export function closeModal(id: string): void {
  getGlobalModalManager().close(id);
}

export function closeAllModals(): void {
  getGlobalModalManager().closeAll();
}

export function hasActiveModal(): boolean {
  return getGlobalModalManager().hasActive();
}

export function getActiveModal(): Modal | undefined {
  return getGlobalModalManager().getActive();
}
