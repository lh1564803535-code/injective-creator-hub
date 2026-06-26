import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    session: {
      active: 125,
      total: 5000,
      averageDuration: "15 minutes",
      peakConcurrent: 350,
      storage: {
        type: "Redis",
        size: "50 MB",
        ttl: "24 hours",
      },
    },
    timestamp: new Date().toISOString(),
  });
}
