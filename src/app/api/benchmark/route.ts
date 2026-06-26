import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    benchmarks: {
      performance: {
        apiResponseTime: "120ms",
        pageLoadTime: "1.2s",
        firstContentfulPaint: "0.8s",
        timeToInteractive: "1.5s",
      },
      reliability: {
        uptime: "99.9%",
        errorRate: "0.1%",
        successRate: "99.9%",
      },
      scale: {
        maxConcurrentUsers: 1000,
        maxTransactionsPerSecond: 100,
        maxCampaigns: 10000,
      },
    },
    timestamp: new Date().toISOString(),
  });
}
