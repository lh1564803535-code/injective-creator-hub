import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    metrics: {
      platform: {
        totalUsers: 156,
        activeUsers: 89,
        totalCampaigns: 42,
        activeCampaigns: 8,
        totalEarnings: 124567.89,
        averageEarnings: 798.51,
      },
      blockchain: {
        totalTransactions: 12500,
        averageBlockTime: 1.2,
        gasUsed: "0.001 INJ",
        successRate: "99.9%",
      },
      ai: {
        totalQueries: 3450,
        averageResponseTime: "0.8s",
        successRate: "98.5%",
      },
    },
    timestamp: new Date().toISOString(),
  });
}
