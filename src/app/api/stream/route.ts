import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    stream: {
      ratePerSecond: 0.0003,
      monthlyTarget: 2000,
      currentEarnings: 1245.67,
      progress: 62.28,
      forecast30Days: 777.60,
      forecastAnnual: 9460.80,
    },
    technology: {
      name: "Superfluid",
      description: "Real-time streaming payments",
      url: "https://superfluid.org",
    },
    timestamp: new Date().toISOString(),
  });
}
