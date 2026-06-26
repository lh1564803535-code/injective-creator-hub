/**
 * Clipboard utilities
 */

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  }
}

export async function readFromClipboard(): Promise<string> {
  try {
    return await navigator.clipboard.readText();
  } catch {
    return "";
  }
}

export function isClipboardSupported(): boolean {
  return typeof navigator !== "undefined" && !!navigator.clipboard;
}

// Copy with notification
export async function copyWithNotification(
  text: string,
  onSuccess?: () => void,
  onError?: () => void
): Promise<void> {
  const success = await copyToClipboard(text);
  if (success) {
    onSuccess?.();
  } else {
    onError?.();
  }
}

// Copy address
export async function copyAddress(address: string): Promise<boolean> {
  return copyToClipboard(address);
}

// Copy transaction hash
export async function copyTxHash(hash: string): Promise<boolean> {
  return copyToClipboard(hash);
}
