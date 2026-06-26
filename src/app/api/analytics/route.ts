import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    analytics: {
      pageViews: {
        total: 125000,
        unique: 45000,
        averageSessionDuration: "3m 45s",
      },
      conversions: {
        walletConnections: 1250,
        campaignSubmissions: 450,
        votes: 3200,
        claims: 380,
      },
      revenue: {
        total: 124567.89,
        averagePerUser: 798.51,
        topEarningCampaign: "DeFi Content Challenge",
      },
    },
    timestamp: new Date().toISOString(),
  });
}
