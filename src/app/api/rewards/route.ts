import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    rewards: {
      total: 1245.67,
      breakdown: [
        { source: "Campaign Rewards", amount: 845.50, percentage: 68 },
        { source: "Voting Income", amount: 125.30, percentage: 10 },
        { source: "Streak Bonuses", amount: 89.20, percentage: 7 },
        { source: "Referral Commissions", amount: 67.80, percentage: 5 },
        { source: "Tips & Donations", amount: 45.00, percentage: 4 },
      ],
      pending: 50.00,
      claimed: 1195.67,
    },
    timestamp: new Date().toISOString(),
  });
}
