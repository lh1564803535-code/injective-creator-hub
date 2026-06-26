/**
 * File utilities
 */

export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

export function getFileNameWithoutExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.slice(0, -1).join(".") : filename;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function isImageFile(filename: string): boolean {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"];
  return imageExtensions.includes(getFileExtension(filename));
}

export function isVideoFile(filename: string): boolean {
  const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi", "mkv"];
  return videoExtensions.includes(getFileExtension(filename));
}

export function isAudioFile(filename: string): boolean {
  const audioExtensions = ["mp3", "wav", "ogg", "aac", "flac", "m4a"];
  return audioExtensions.includes(getFileExtension(filename));
}

export function isDocumentFile(filename: string): boolean {
  const docExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv"];
  return docExtensions.includes(getFileExtension(filename));
}

export function getFileType(filename: string): "image" | "video" | "audio" | "document" | "other" {
  if (isImageFile(filename)) return "image";
  if (isVideoFile(filename)) return "video";
  if (isAudioFile(filename)) return "audio";
  if (isDocumentFile(filename)) return "document";
  return "other";
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function downloadFile(url: string, filename: string): void {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  downloadFile(url, filename);
  URL.revokeObjectURL(url);
}
