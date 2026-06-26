import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    incidents: [
      {
        id: "inc_1",
        title: "Scheduled Maintenance",
        description: "Platform maintenance for security updates",
        date: "2026-06-20",
        duration: "2 hours",
        impact: "low",
        status: "resolved",
      },
    ],
    total: 1,
    active: 0,
    resolved: 1,
    timestamp: new Date().toISOString(),
  });
}
