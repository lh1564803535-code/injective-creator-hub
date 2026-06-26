/**
 * Notification utilities
 */

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

class NotificationManager {
  private notifications: Notification[] = [];
  private listeners: Set<(notifications: Notification[]) => void> = new Set();
  private maxNotifications: number = 100;

  add(notification: Omit<Notification, "id" | "timestamp" | "read">): string {
    const id = crypto.randomUUID();
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
      read: false,
    };

    this.notifications.unshift(newNotification);

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

  remove(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notify();
  }

  clear(): void {
    this.notifications = [];
    this.notify();
  }

  getAll(): Notification[] {
    return [...this.notifications];
  }

  getUnread(): Notification[] {
    return this.notifications.filter((n) => !n.read);
  }

  getUnreadCount(): number {
    return this.getUnread().length;
  }

  subscribe(listener: (notifications: Notification[]) => void): () => void {
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

export function createNotificationManager(): NotificationManager {
  return new NotificationManager();
}

export function createNotification(
  type: Notification["type"],
  title: string,
  message: string,
  action?: Notification["action"]
): Omit<Notification, "id" | "timestamp" | "read"> {
  return { type, title, message, action };
}

// Toast notifications
interface Toast {
  id: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
  duration: number;
}

class ToastManager {
  private toasts: Toast[] = [];
  private listeners: Set<(toasts: Toast[]) => void> = new Set();

  show(type: Toast["type"], message: string, duration: number = 5000): string {
    const id = crypto.randomUUID();
    const toast: Toast = { id, type, message, duration };

    this.toasts.push(toast);
    this.notify();

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }

    return id;
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
  duration?: number
): Omit<Toast, "id"> {
  return { type, message, duration: duration ?? 5000 };
}
