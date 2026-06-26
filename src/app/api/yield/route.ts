import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    yield: {
      totalEarned: 1245.67,
      currentApy: 8.5,
      stakingRewards: 125.30,
      campaignRewards: 845.50,
      referralCommissions: 67.80,
      streakBonuses: 89.20,
    },
    forecast: {
      next30Days: 777.60,
      next90Days: 2332.80,
      nextYear: 9460.80,
    },
    timestamp: new Date().toISOString(),
  });
}
