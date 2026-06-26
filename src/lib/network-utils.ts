/**
 * Network utilities
 */

export function isOnline(): boolean {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine;
}

export function addOnlineListener(handler: () => void): () => void {
  window.addEventListener("online", handler);
  return () => window.removeEventListener("online", handler);
}

export function addOfflineListener(handler: () => void): () => void {
  window.addEventListener("offline", handler);
  return () => window.removeEventListener("offline", handler);
}

export function addNetworkStatusListener(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  const removeOnline = addOnlineListener(onOnline);
  const removeOffline = addOfflineListener(onOffline);
  return () => {
    removeOnline();
    removeOffline();
  };
}

export async function checkUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      mode: "no-cors",
      signal: AbortSignal.timeout(5000),
    });
    return true;
  } catch {
    return false;
  }
}

export async function waitForOnline(timeout: number = 30000): Promise<boolean> {
  if (isOnline()) return true;

  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      window.removeEventListener("online", onOnline);
      resolve(false);
    }, timeout);

    const onOnline = () => {
      clearTimeout(timeoutId);
      window.removeEventListener("online", onOnline);
      resolve(true);
    };

    window.addEventListener("online", onOnline);
  });
}

export function getConnectionType(): string {
  if (typeof navigator === "undefined") return "unknown";

  const connection = (navigator as any).connection;
  if (!connection) return "unknown";

  return connection.effectiveType || connection.type || "unknown";
}

export function getDownlink(): number | null {
  if (typeof navigator === "undefined") return null;

  const connection = (navigator as any).connection;
  return connection?.downlink || null;
}

export function getRtt(): number | null {
  if (typeof navigator === "undefined") return null;

  const connection = (navigator as any).connection;
  return connection?.rtt || null;
}

export function isSlowConnection(): boolean {
  const type = getConnectionType();
  return type === "slow-2g" || type === "2g";
}

export function getNetworkInfo(): {
  online: boolean;
  type: string;
  downlink: number | null;
  rtt: number | null;
  isSlow: boolean;
} {
  return {
    online: isOnline(),
    type: getConnectionType(),
    downlink: getDownlink(),
    rtt: getRtt(),
    isSlow: isSlowConnection(),
  };
}
