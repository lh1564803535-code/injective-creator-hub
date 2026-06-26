import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    earnings: {
      total: 124567.89,
      today: 12.45,
      thisMonth: 1245.67,
      thisYear: 14948.04,
    },
    streaming: {
      ratePerSecond: 0.0003,
      monthlyTarget: 2000,
      progress: 62.28,
    },
    timestamp: new Date().toISOString(),
  });
}
