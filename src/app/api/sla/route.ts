import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    sla: {
      uptime: {
        target: "99.9%",
        actual: "99.95%",
        status: "met",
      },
      responseTime: {
        target: "< 200ms",
        actual: "120ms",
        status: "met",
      },
      resolutionTime: {
        target: "< 4 hours",
        actual: "2.5 hours",
        status: "met",
      },
    },
    lastReview: "2026-06-25",
    nextReview: "2026-07-25",
    timestamp: new Date().toISOString(),
  });
}
