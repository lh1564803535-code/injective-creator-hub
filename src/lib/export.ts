/**
 * Export utilities
 */

export function exportToCsv<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns?: Array<{ key: keyof T; label: string }>
): void {
  if (data.length === 0) return;

  const cols = columns || Object.keys(data[0]).map((key) => ({ key, label: key }));
  const headers = cols.map((col) => col.label);

  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      cols.map((col) => {
        const value = row[col.key];
        const stringValue = String(value ?? "");
        if (stringValue.includes(",") || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(",")
    ),
  ].join("\n");

  downloadText(csvContent, `${filename}.csv`, "text/csv");
}

export function exportToJson<T>(data: T, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  downloadText(json, `${filename}.json`, "application/json");
}

export function exportToTxt(data: string, filename: string): void {
  downloadText(data, `${filename}.txt`, "text/plain");
}

export function exportLeaderboard(
  creators: Array<{ address: string; earnings: number; votes: number; submissions: number }>,
  filename: string = "leaderboard"
): void {
  exportToCsv(creators, filename, [
    { key: "address", label: "Address" },
    { key: "earnings", label: "Earnings (USDC)" },
    { key: "votes", label: "Votes" },
    { key: "submissions", label: "Submissions" },
  ]);
}

export function exportCampaigns(
  campaigns: Array<{ title: string; reward: number; deadline: number; status: string }>,
  filename: string = "campaigns"
): void {
  exportToCsv(
    campaigns.map((c) => ({
      ...c,
      deadline: new Date(c.deadline * 1000).toISOString(),
    })),
    filename,
    [
      { key: "title", label: "Title" },
      { key: "reward", label: "Reward (USDC)" },
      { key: "deadline", label: "Deadline" },
      { key: "status", label: "Status" },
    ]
  );
}

// Internal download helper
function downloadText(text: string, filename: string, mimeType: string): void {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
