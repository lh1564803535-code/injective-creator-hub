/**
 * Global Notification utilities
 */

interface GlobalNotification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  dismissed: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

class GlobalNotificationManager {
  private notifications: GlobalNotification[] = [];
  private listeners: Set<(notifications: GlobalNotification[]) => void> = new Set();
  private maxNotifications: number = 100;

  add(options: Omit<GlobalNotification, "id" | "timestamp" | "read" | "dismissed">): string {
    const id = crypto.randomUUID();
    const notification: GlobalNotification = {
      ...options,
      id,
      timestamp: Date.now(),
      read: false,
      dismissed: false,
    };

    this.notifications.unshift(notification);

    if (this.notifications.length > this.maxNotifications) {
      this.notifications = this.notifications.slice(0, this.maxNotifications);
    }

    this.notify();
    return id;
  }

  markAsRead(id: string): void {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
      this.notify();
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach((n) => (n.read = true));
    this.notify();
  }

  dismiss(id: string): void {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      notification.dismissed = true;
      this.notify();
    }
  }

  undismiss(id: string): void {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      notification.dismissed = false;
      this.notify();
    }
  }

  remove(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notify();
  }

  clear(): void {
    this.notifications = [];
    this.notify();
  }

  getAll(): GlobalNotification[] {
    return [...this.notifications];
  }

  getActive(): GlobalNotification[] {
    return this.notifications.filter((n) => !n.dismissed);
  }

  getUnread(): GlobalNotification[] {
    return this.notifications.filter((n) => !n.read && !n.dismissed);
  }

  getUnreadCount(): number {
    return this.getUnread().length;
  }

  subscribe(listener: (notifications: GlobalNotification[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getAll());
      } catch (error) {
        console.error("Error in notification listener:", error);
      }
    });
  }
}

export function createGlobalNotificationManager(): GlobalNotificationManager {
  return new GlobalNotificationManager();
}

export function createGlobalNotification(
  type: GlobalNotification["type"],
  title: string,
  message: string,
  action?: GlobalNotification["action"]
): Omit<GlobalNotification, "id" | "timestamp" | "read" | "dismissed"> {
  return { type, title, message, action };
}

// Global notification manager
let globalNotificationManager: GlobalNotificationManager | null = null;

export function getGlobalNotificationManager(): GlobalNotificationManager {
  if (!globalNotificationManager) {
    globalNotificationManager = createGlobalNotificationManager();
  }
  return globalNotificationManager;
}

export function setGlobalNotificationManager(manager: GlobalNotificationManager): void {
  globalNotificationManager = manager;
}

// Convenience functions
export function addGlobalNotification(
  type: GlobalNotification["type"],
  title: string,
  message: string,
  action?: GlobalNotification["action"]
): string {
  return getGlobalNotificationManager().add({ type, title, message, action });
}

export function addGlobalInfoNotification(title: string, message: string, action?: GlobalNotification["action"]): string {
  return getGlobalNotificationManager().add({ type: "info", title, message, action });
}

export function addGlobalSuccessNotification(title: string, message: string, action?: GlobalNotification["action"]): string {
  return getGlobalNotificationManager().add({ type: "success", title, message, action });
}

export function addGlobalWarningNotification(title: string, message: string, action?: GlobalNotification["action"]): string {
  return getGlobalNotificationManager().add({ type: "warning", title, message, action });
}

export function addGlobalErrorNotification(title: string, message: string, action?: GlobalNotification["action"]): string {
  return getGlobalNotificationManager().add({ type: "error", title, message, action });
}

export function markGlobalNotificationAsRead(id: string): void {
  getGlobalNotificationManager().markAsRead(id);
}

export function markAllGlobalNotificationsAsRead(): void {
  getGlobalNotificationManager().markAllAsRead();
}

export function dismissGlobalNotification(id: string): void {
  getGlobalNotificationManager().dismiss(id);
}

export function removeGlobalNotification(id: string): void {
  getGlobalNotificationManager().remove(id);
}

export function clearGlobalNotifications(): void {
  getGlobalNotificationManager().clear();
}

export function getGlobalUnreadNotificationCount(): number {
  return getGlobalNotificationManager().getUnreadCount();
}
