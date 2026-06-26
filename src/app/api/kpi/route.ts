import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    kpi: {
      userGrowth: {
        current: 156,
        previous: 120,
        change: "+30%",
        trend: "up",
      },
      revenueGrowth: {
        current: 124567.89,
        previous: 98000,
        change: "+27%",
        trend: "up",
      },
      campaignSuccess: {
        current: 42,
        previous: 35,
        change: "+20%",
        trend: "up",
      },
      retentionRate: {
        current: "78%",
        previous: "72%",
        change: "+6%",
        trend: "up",
      },
    },
    timestamp: new Date().toISOString(),
  });
}
