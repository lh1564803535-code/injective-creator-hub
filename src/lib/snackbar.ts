/**
 * Snackbar utilities
 */

interface Snackbar {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  duration: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible: boolean;
}

class SnackbarManager {
  private snacks: Snackbar[] = [];
  private listeners: Set<(snacks: Snackbar[]) => void> = new Set();

  show(options: Omit<Snackbar, "id">): string {
    const id = crypto.randomUUID();
    const snack: Snackbar = {
      ...options,
      id,
    };

    this.snacks.push(snack);
    this.notify();

    if (snack.duration > 0) {
      setTimeout(() => this.dismiss(id), snack.duration);
    }

    return id;
  }

  info(message: string, options?: Partial<Omit<Snackbar, "id" | "type" | "message">>): string {
    return this.show({
      type: "info",
      message,
      duration: 5000,
      dismissible: true,
      ...options,
    });
  }

  success(message: string, options?: Partial<Omit<Snackbar, "id" | "type" | "message">>): string {
    return this.show({
      type: "success",
      message,
      duration: 5000,
      dismissible: true,
      ...options,
    });
  }

  warning(message: string, options?: Partial<Omit<Snackbar, "id" | "type" | "message">>): string {
    return this.show({
      type: "warning",
      message,
      duration: 5000,
      dismissible: true,
      ...options,
    });
  }

  error(message: string, options?: Partial<Omit<Snackbar, "id" | "type" | "message">>): string {
    return this.show({
      type: "error",
      message,
      duration: 5000,
      dismissible: true,
      ...options,
    });
  }

  dismiss(id: string): void {
    this.snacks = this.snacks.filter((s) => s.id !== id);
    this.notify();
  }

  clear(): void {
    this.snacks = [];
    this.notify();
  }

  getAll(): Snackbar[] {
    return [...this.snacks];
  }

  subscribe(listener: (snacks: Snackbar[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getAll());
      } catch (error) {
        console.error("Error in snackbar listener:", error);
      }
    });
  }
}

export function createSnackbarManager(): SnackbarManager {
  return new SnackbarManager();
}

export function createSnackbar(
  type: Snackbar["type"],
  message: string,
  options?: Partial<Omit<Snackbar, "id" | "type" | "message">>
): Omit<Snackbar, "id"> {
  return {
    type,
    message,
    duration: 5000,
    dismissible: true,
    ...options,
  };
}

// Global snackbar manager
let globalSnackbarManager: SnackbarManager | null = null;

export function getGlobalSnackbarManager(): SnackbarManager {
  if (!globalSnackbarManager) {
    globalSnackbarManager = createSnackbarManager();
  }
  return globalSnackbarManager;
}

export function setGlobalSnackbarManager(manager: SnackbarManager): void {
  globalSnackbarManager = manager;
}

// Convenience functions
export function showSnackbar(
  type: Snackbar["type"],
  message: string,
  options?: Partial<Omit<Snackbar, "id" | "type" | "message">>
): string {
  return getGlobalSnackbarManager().show({ type, message, duration: 5000, dismissible: true, ...options });
}

export function showInfoSnackbar(message: string, options?: Partial<Omit<Snackbar, "id" | "type" | "message">>): string {
  return getGlobalSnackbarManager().info(message, options);
}

export function showSuccessSnackbar(message: string, options?: Partial<Omit<Snackbar, "id" | "type" | "message">>): string {
  return getGlobalSnackbarManager().success(message, options);
}

export function showWarningSnackbar(message: string, options?: Partial<Omit<Snackbar, "id" | "type" | "message">>): string {
  return getGlobalSnackbarManager().warning(message, options);
}

export function showErrorSnackbar(message: string, options?: Partial<Omit<Snackbar, "id" | "type" | "message">>): string {
  return getGlobalSnackbarManager().error(message, options);
}

export function dismissSnackbar(id: string): void {
  getGlobalSnackbarManager().dismiss(id);
}

export function clearSnackbars(): void {
  getGlobalSnackbarManager().clear();
}
