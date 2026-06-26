import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    performance: {
      api: {
        averageResponseTime: "120ms",
        p95ResponseTime: "250ms",
        p99ResponseTime: "500ms",
        requestsPerSecond: 150,
      },
      database: {
        queryTime: "15ms",
        connectionPool: "95% available",
        cacheHitRate: "85%",
      },
      frontend: {
        firstContentfulPaint: "0.8s",
        largestContentfulPaint: "1.2s",
        cumulativeLayoutShift: "0.05",
        timeToInteractive: "1.5s",
      },
    },
    timestamp: new Date().toISOString(),
  });
}
