import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    cache: {
      type: "Redis",
      status: "connected",
      hitRate: "85%",
      missRate: "15%",
      size: "256 MB",
      keys: 12500,
      ttl: {
        default: "1 hour",
        sessions: "24 hours",
        api: "5 minutes",
      },
    },
    timestamp: new Date().toISOString(),
  });
}
