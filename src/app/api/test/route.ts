import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    test: {
      unit: {
        total: 150,
        passed: 148,
        failed: 2,
        coverage: "95%",
      },
      integration: {
        total: 50,
        passed: 48,
        failed: 2,
        coverage: "85%",
      },
      e2e: {
        total: 25,
        passed: 24,
        failed: 1,
        coverage: "75%",
      },
    },
    lastRun: "2026-06-26T10:00:00Z",
    timestamp: new Date().toISOString(),
  });
}
