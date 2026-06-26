/**
 * Banner utilities
 */

interface Banner {
  id: string;
  type: "info" | "success" | "warning" | "error" | "announcement";
  message: string;
  dismissible: boolean;
  dismissed: boolean;
  timestamp: number;
  priority: number;
}

class BannerManager {
  private banners: Banner[] = [];
  private listeners: Set<(banners: Banner[]) => void> = new Set();

  add(options: Omit<Banner, "id" | "dismissed" | "timestamp">): string {
    const id = crypto.randomUUID();
    const banner: Banner = {
      ...options,
      id,
      dismissed: false,
      timestamp: Date.now(),
    };

    this.banners.push(banner);
    this.banners.sort((a, b) => b.priority - a.priority);
    this.notify();
    return id;
  }

  dismiss(id: string): void {
    const banner = this.banners.find((b) => b.id === id);
    if (banner) {
      banner.dismissed = true;
      this.notify();
    }
  }

  remove(id: string): void {
    this.banners = this.banners.filter((b) => b.id !== id);
    this.notify();
  }

  clear(): void {
    this.banners = [];
    this.notify();
  }

  getAll(): Banner[] {
    return [...this.banners];
  }

  getActive(): Banner[] {
    return this.banners.filter((b) => !b.dismissed);
  }

  getTop(): Banner | undefined {
    return this.getActive()[0];
  }

  subscribe(listener: (banners: Banner[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getAll());
      } catch (error) {
        console.error("Error in banner listener:", error);
      }
    });
  }
}

export function createBannerManager(): BannerManager {
  return new BannerManager();
}

export function createBanner(
  type: Banner["type"],
  message: string,
  options?: Partial<Omit<Banner, "id" | "type" | "message" | "dismissed" | "timestamp">>
): Omit<Banner, "id" | "dismissed" | "timestamp"> {
  return {
    type,
    message,
    dismissible: true,
    priority: 0,
    ...options,
  };
}

// Global banner manager
let globalBannerManager: BannerManager | null = null;

export function getGlobalBannerManager(): BannerManager {
  if (!globalBannerManager) {
    globalBannerManager = createBannerManager();
  }
  return globalBannerManager;
}

export function setGlobalBannerManager(manager: BannerManager): void {
  globalBannerManager = manager;
}

// Convenience functions
export function showBanner(
  type: Banner["type"],
  message: string,
  options?: Partial<Omit<Banner, "id" | "type" | "message" | "dismissed" | "timestamp">>
): string {
  return getGlobalBannerManager().add({ type, message, dismissible: true, priority: 0, ...options });
}

export function showInfoBanner(message: string, options?: Partial<Omit<Banner, "id" | "type" | "message" | "dismissed" | "timestamp">>): string {
  return getGlobalBannerManager().add({ type: "info", message, dismissible: true, priority: 0, ...options });
}

export function showSuccessBanner(message: string, options?: Partial<Omit<Banner, "id" | "type" | "message" | "dismissed" | "timestamp">>): string {
  return getGlobalBannerManager().add({ type: "success", message, dismissible: true, priority: 0, ...options });
}

export function showWarningBanner(message: string, options?: Partial<Omit<Banner, "id" | "type" | "message" | "dismissed" | "timestamp">>): string {
  return getGlobalBannerManager().add({ type: "warning", message, dismissible: true, priority: 0, ...options });
}

export function showErrorBanner(message: string, options?: Partial<Omit<Banner, "id" | "type" | "message" | "dismissed" | "timestamp">>): string {
  return getGlobalBannerManager().add({ type: "error", message, dismissible: true, priority: 0, ...options });
}

export function showAnnouncementBanner(message: string, options?: Partial<Omit<Banner, "id" | "type" | "message" | "dismissed" | "timestamp">>): string {
  return getGlobalBannerManager().add({ type: "announcement", message, dismissible: true, priority: 10, ...options });
}

export function dismissBanner(id: string): void {
  getGlobalBannerManager().dismiss(id);
}

export function clearBanners(): void {
  getGlobalBannerManager().clear();
}
