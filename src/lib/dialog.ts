/**
 * Dialog utilities
 */

interface DialogConfig {
  title: string;
  message: string;
  type: "alert" | "confirm" | "prompt";
  defaultValue?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: (value?: string) => void;
  onCancel?: () => void;
}

class DialogManager {
  private dialogs: DialogConfig[] = [];
  private listeners: Set<(dialogs: DialogConfig[]) => void> = new Set();

  alert(title: string, message: string): Promise<void> {
    return new Promise((resolve) => {
      this.dialogs.push({
        title,
        message,
        type: "alert",
        confirmText: "OK",
        onConfirm: () => {
          this.removeDialog(0);
          resolve();
        },
      });
      this.notify();
    });
  }

  confirm(title: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.dialogs.push({
        title,
        message,
        type: "confirm",
        confirmText: "Confirm",
        cancelText: "Cancel",
        onConfirm: () => {
          this.removeDialog(0);
          resolve(true);
        },
        onCancel: () => {
          this.removeDialog(0);
          resolve(false);
        },
      });
      this.notify();
    });
  }

  prompt(title: string, message: string, defaultValue?: string): Promise<string | null> {
    return new Promise((resolve) => {
      this.dialogs.push({
        title,
        message,
        type: "prompt",
        defaultValue,
        confirmText: "Submit",
        cancelText: "Cancel",
        onConfirm: (value) => {
          this.removeDialog(0);
          resolve(value ?? null);
        },
        onCancel: () => {
          this.removeDialog(0);
          resolve(null);
        },
      });
      this.notify();
    });
  }

  private removeDialog(index: number): void {
    this.dialogs.splice(index, 1);
    this.notify();
  }

  getDialogs(): DialogConfig[] {
    return [...this.dialogs];
  }

  subscribe(listener: (dialogs: DialogConfig[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getDialogs());
      } catch (error) {
        console.error("Error in dialog listener:", error);
      }
    });
  }
}

export function createDialogManager(): DialogManager {
  return new DialogManager();
}

export function createDialogConfig(
  title: string,
  message: string,
  type: DialogConfig["type"],
  options?: Partial<DialogConfig>
): DialogConfig {
  return {
    title,
    message,
    type,
    ...options,
  };
}
