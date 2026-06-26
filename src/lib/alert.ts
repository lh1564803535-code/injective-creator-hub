/**
 * Alert utilities
 */

interface Alert {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  dismissible: boolean;
  dismissed: boolean;
  timestamp: number;
}

class AlertManager {
  private alerts: Alert[] = [];
  private listeners: Set<(alerts: Alert[]) => void> = new Set();

  add(options: Omit<Alert, "id" | "dismissed" | "timestamp">): string {
    const id = crypto.randomUUID();
    const alert: Alert = {
      ...options,
      id,
      dismissed: false,
      timestamp: Date.now(),
    };

    this.alerts.push(alert);
    this.notify();
    return id;
  }

  dismiss(id: string): void {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) {
      alert.dismissed = true;
      this.notify();
    }
  }

  undismiss(id: string): void {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) {
      alert.dismissed = false;
      this.notify();
    }
  }

  remove(id: string): void {
    this.alerts = this.alerts.filter((a) => a.id !== id);
    this.notify();
  }

  clear(): void {
    this.alerts = [];
    this.notify();
  }

  getAll(): Alert[] {
    return [...this.alerts];
  }

  getActive(): Alert[] {
    return this.alerts.filter((a) => !a.dismissed);
  }

  getDismissed(): Alert[] {
    return this.alerts.filter((a) => a.dismissed);
  }

  subscribe(listener: (alerts: Alert[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getAll());
      } catch (error) {
        console.error("Error in alert listener:", error);
      }
    });
  }
}

export function createAlertManager(): AlertManager {
  return new AlertManager();
}

export function createAlert(
  type: Alert["type"],
  title: string,
  message: string,
  options?: Partial<Omit<Alert, "id" | "type" | "title" | "message" | "dismissed" | "timestamp">>
): Omit<Alert, "id" | "dismissed" | "timestamp"> {
  return {
    type,
    title,
    message,
    dismissible: true,
    ...options,
  };
}

// Global alert manager
let globalAlertManager: AlertManager | null = null;

export function getGlobalAlertManager(): AlertManager {
  if (!globalAlertManager) {
    globalAlertManager = createAlertManager();
  }
  return globalAlertManager;
}

export function setGlobalAlertManager(manager: AlertManager): void {
  globalAlertManager = manager;
}

// Convenience functions
export function showAlert(
  type: Alert["type"],
  title: string,
  message: string,
  options?: Partial<Omit<Alert, "id" | "type" | "title" | "message" | "dismissed" | "timestamp">>
): string {
  return getGlobalAlertManager().add({ type, title, message, dismissible: true, ...options });
}

export function showInfoAlert(title: string, message: string, options?: Partial<Omit<Alert, "id" | "type" | "title" | "message" | "dismissed" | "timestamp">>): string {
  return getGlobalAlertManager().add({ type: "info", title, message, dismissible: true, ...options });
}

export function showSuccessAlert(title: string, message: string, options?: Partial<Omit<Alert, "id" | "type" | "title" | "message" | "dismissed" | "timestamp">>): string {
  return getGlobalAlertManager().add({ type: "success", title, message, dismissible: true, ...options });
}

export function showWarningAlert(title: string, message: string, options?: Partial<Omit<Alert, "id" | "type" | "title" | "message" | "dismissed" | "timestamp">>): string {
  return getGlobalAlertManager().add({ type: "warning", title, message, dismissible: true, ...options });
}

export function showErrorAlert(title: string, message: string, options?: Partial<Omit<Alert, "id" | "type" | "title" | "message" | "dismissed" | "timestamp">>): string {
  return getGlobalAlertManager().add({ type: "error", title, message, dismissible: true, ...options });
}

export function dismissAlert(id: string): void {
  getGlobalAlertManager().dismiss(id);
}

export function clearAlerts(): void {
  getGlobalAlertManager().clear();
}
