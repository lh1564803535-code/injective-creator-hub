import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    lint: {
      totalFiles: 150,
      issues: {
        errors: 0,
        warnings: 5,
        info: 12,
      },
      rules: {
        "no-unused-vars": 2,
        "no-console": 3,
        "prefer-const": 5,
        "no-explicit-any": 2,
      },
      lastRun: "2026-06-26T10:00:00Z",
    },
    timestamp: new Date().toISOString(),
  });
}
