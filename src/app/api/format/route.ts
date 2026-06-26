import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    format: {
      totalFiles: 150,
      formatted: 150,
      unformatted: 0,
      lastRun: "2026-06-26T10:00:00Z",
      config: {
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
        semi: true,
        singleQuote: false,
        trailingComma: "all",
      },
    },
    timestamp: new Date().toISOString(),
  });
}
