/**
 * Download utilities
 */

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

export function downloadText(text: string, filename: string, mimeType: string = "text/plain"): void {
  const blob = new Blob([text], { type: mimeType });
  downloadBlob(blob, filename);
}

export function downloadJson(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  downloadText(json, `${filename}.json`, "application/json");
}

export function downloadCsv(data: Record<string, unknown>[], filename: string): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        const stringValue = String(value ?? "");
        // Escape commas and quotes
        if (stringValue.includes(",") || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(",")
    ),
  ].join("\n");

  downloadText(csvContent, `${filename}.csv`, "text/csv");
}

export function downloadImage(canvas: HTMLCanvasElement, filename: string, format: "png" | "jpeg" = "png"): void {
  const mimeType = format === "png" ? "image/png" : "image/jpeg";
  canvas.toBlob((blob) => {
    if (blob) {
      downloadBlob(blob, `${filename}.${format}`);
    }
  }, mimeType);
}
