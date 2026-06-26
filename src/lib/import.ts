/**
 * Import utilities
 */

export function importFromCsv<T>(csvText: string, delimiter: string = ","): T[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^"|"$/g, ""));
  const data: T[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i], delimiter);
    const row: Record<string, unknown> = {};

    headers.forEach((header, index) => {
      const value = values[index]?.trim() ?? "";
      // Try to parse numbers
      const num = Number(value);
      row[header] = isNaN(num) || value === "" ? value : num;
    });

    data.push(row as T);
  }

  return data;
}

function parseCsvLine(line: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }

  result.push(current);
  return result;
}

export function importFromJson<T>(jsonText: string): T | null {
  try {
    return JSON.parse(jsonText);
  } catch {
    return null;
  }
}

export function importFromFile(accept: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        reject(new Error("No file selected"));
        return;
      }

      try {
        const text = await file.text();
        resolve(text);
      } catch (error) {
        reject(error);
      }
    };

    input.click();
  });
}

export async function importCsvFile<T>(delimiter: string = ","): Promise<T[]> {
  const text = await importFromFile(".csv");
  return importFromCsv<T>(text, delimiter);
}

export async function importJsonFile<T>(): Promise<T> {
  const text = await importFromFile(".json");
  const result = importFromJson<T>(text);
  if (result === null) {
    throw new Error("Invalid JSON file");
  }
  return result;
}
