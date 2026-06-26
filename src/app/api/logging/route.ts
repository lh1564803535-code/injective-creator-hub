import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    logging: {
      level: "info",
      retention: "30 days",
      totalLogs: 125000,
      categories: {
        application: 75000,
        security: 25000,
        audit: 15000,
        performance: 10000,
      },
      recentErrors: [
        {
          timestamp: "2026-06-26T10:30:00Z",
          message: "Rate limit exceeded for IP 192.168.1.1",
          level: "warning",
        },
      ],
    },
    timestamp: new Date().toISOString(),
  });
}
