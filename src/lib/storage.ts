/**
 * Local storage utilities
 */

const PREFIX = "injective-creator-hub";

function getKey(key: string): string {
  return `${PREFIX}:${key}`;
}

export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;

  try {
    const item = localStorage.getItem(getKey(key));
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(getKey(key), JSON.stringify(value));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(getKey(key));
  } catch (error) {
    console.error("Failed to remove from localStorage:", error);
  }
}

export function clearStorage(): void {
  if (typeof window === "undefined") return;

  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
}

// Specific storage helpers
export function getLocale(): string {
  return getStorageItem("locale", "zh");
}

export function setLocale(locale: string): void {
  setStorageItem("locale", locale);
}

export function getTheme(): "dark" | "light" {
  return getStorageItem("theme", "dark");
}

export function setTheme(theme: "dark" | "light"): void {
  setStorageItem("theme", theme);
}

export function getDismissedNotifications(): string[] {
  return getStorageItem("dismissed-notifications", []);
}

export function addDismissedNotification(id: string): void {
  const dismissed = getDismissedNotifications();
  if (!dismissed.includes(id)) {
    setStorageItem("dismissed-notifications", [...dismissed, id]);
  }
}
