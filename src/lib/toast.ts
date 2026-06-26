/**
 * Toast utilities
 */

interface Toast {
  id: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
  description?: string;
  duration: number;
  position: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  action?: {
    label: string;
    onClick: () => void;
  };
}

class ToastManager {
  private toasts: Toast[] = [];
  private listeners: Set<(toasts: Toast[]) => void> = new Set();

  show(options: Omit<Toast, "id">): string {
    const id = crypto.randomUUID();
    const toast: Toast = {
      ...options,
      id,
    };

    this.toasts.push(toast);
    this.notify();

    if (toast.duration > 0) {
      setTimeout(() => this.dismiss(id), toast.duration);
    }

    return id;
  }

  info(message: string, options?: Partial<Omit<Toast, "id" | "type" | "message">>): string {
    return this.show({
      type: "info",
      message,
      duration: 5000,
      position: "top-right",
      ...options,
    });
  }

  success(message: string, options?: Partial<Omit<Toast, "id" | "type" | "message">>): string {
    return this.show({
      type: "success",
      message,
      duration: 5000,
      position: "top-right",
      ...options,
    });
  }

  warning(message: string, options?: Partial<Omit<Toast, "id" | "type" | "message">>): string {
    return this.show({
      type: "warning",
      message,
      duration: 5000,
      position: "top-right",
      ...options,
    });
  }

  error(message: string, options?: Partial<Omit<Toast, "id" | "type" | "message">>): string {
    return this.show({
      type: "error",
      message,
      duration: 5000,
      position: "top-right",
      ...options,
    });
  }

  dismiss(id: string): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  clear(): void {
    this.toasts = [];
    this.notify();
  }

  getAll(): Toast[] {
    return [...this.toasts];
  }

  getByPosition(position: Toast["position"]): Toast[] {
    return this.toasts.filter((t) => t.position === position);
  }

  subscribe(listener: (toasts: Toast[]) => void): () => void {
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

export function createToastManager(): ToastManager {
  return new ToastManager();
}

export function createToast(
  type: Toast["type"],
  message: string,
  options?: Partial<Omit<Toast, "id" | "type" | "message">>
): Omit<Toast, "id"> {
  return {
    type,
    message,
    duration: 5000,
    position: "top-right",
    ...options,
  };
}

// Global toast manager
let globalToastManager: ToastManager | null = null;

export function getGlobalToastManager(): ToastManager {
  if (!globalToastManager) {
    globalToastManager = createToastManager();
  }
  return globalToastManager;
}

export function setGlobalToastManager(manager: ToastManager): void {
  globalToastManager = manager;
}

// Convenience functions
export function showToast(
  type: Toast["type"],
  message: string,
  options?: Partial<Omit<Toast, "id" | "type" | "message">>
): string {
  return getGlobalToastManager().show({ type, message, duration: 5000, position: "top-right", ...options });
}

export function showInfoToast(message: string, options?: Partial<Omit<Toast, "id" | "type" | "message">>): string {
  return getGlobalToastManager().info(message, options);
}

export function showSuccessToast(message: string, options?: Partial<Omit<Toast, "id" | "type" | "message">>): string {
  return getGlobalToastManager().success(message, options);
}

export function showWarningToast(message: string, options?: Partial<Omit<Toast, "id" | "type" | "message">>): string {
  return getGlobalToastManager().warning(message, options);
}

export function showErrorToast(message: string, options?: Partial<Omit<Toast, "id" | "type" | "message">>): string {
  return getGlobalToastManager().error(message, options);
}

export function dismissToast(id: string): void {
  getGlobalToastManager().dismiss(id);
}

export function clearToasts(): void {
  getGlobalToastManager().clear();
}
