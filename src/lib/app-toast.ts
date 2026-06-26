/**
 * App Toast utilities
 */

interface AppToast {
  id: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
  duration: number;
  dismissed: boolean;
}

class AppToastManager {
  private toasts: AppToast[] = [];
  private listeners: Set<(toasts: AppToast[]) => void> = new Set();

  show(type: AppToast["type"], message: string, duration: number = 5000): string {
    const id = crypto.randomUUID();
    const toast: AppToast = {
      id,
      type,
      message,
      duration,
      dismissed: false,
    };

    this.toasts.push(toast);
    this.notify();

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }

    return id;
  }

  dismiss(id: string): void {
    const toast = this.toasts.find((t) => t.id === id);
    if (toast) {
      toast.dismissed = true;
      this.notify();

      // Remove after animation
      setTimeout(() => {
        this.toasts = this.toasts.filter((t) => t.id !== id);
        this.notify();
      }, 300);
    }
  }

  clear(): void {
    this.toasts = [];
    this.notify();
  }

  getAll(): AppToast[] {
    return [...this.toasts];
  }

  getActive(): AppToast[] {
    return this.toasts.filter((t) => !t.dismissed);
  }

  subscribe(listener: (toasts: AppToast[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getAll());
      } catch (error) {
        console.error("Error in toast listener:", error);
      }
    });
  }
}

export function createAppToastManager(): AppToastManager {
  return new AppToastManager();
}

// Global app toast manager
let globalAppToastManager: AppToastManager | null = null;

export function getGlobalAppToastManager(): AppToastManager {
  if (!globalAppToastManager) {
    globalAppToastManager = createAppToastManager();
  }
  return globalAppToastManager;
}

export function setGlobalAppToastManager(manager: AppToastManager): void {
  globalAppToastManager = manager;
}

// Convenience functions
export function showAppToast(type: AppToast["type"], message: string, duration?: number): string {
  return getGlobalAppToastManager().show(type, message, duration);
}

export function showAppInfoToast(message: string, duration?: number): string {
  return getGlobalAppToastManager().show("info", message, duration);
}

export function showAppSuccessToast(message: string, duration?: number): string {
  return getGlobalAppToastManager().show("success", message, duration);
}

export function showAppWarningToast(message: string, duration?: number): string {
  return getGlobalAppToastManager().show("warning", message, duration);
}

export function showAppErrorToast(message: string, duration?: number): string {
  return getGlobalAppToastManager().show("error", message, duration);
}

export function dismissAppToast(id: string): void {
  getGlobalAppToastManager().dismiss(id);
}

export function clearAppToasts(): void {
  getGlobalAppToastManager().clear();
}
