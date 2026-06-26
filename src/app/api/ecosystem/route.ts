import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ecosystem: {
      totalProjects: 250,
      totalValueLocked: "$1.2B",
      dailyActiveUsers: 15000,
      totalTransactions: 5000000,
    },
    categories: [
      { name: "DeFi", count: 120, percentage: 48 },
      { name: "NFT", count: 45, percentage: 18 },
      { name: "Social", count: 35, percentage: 14 },
      { name: "Gaming", count: 25, percentage: 10 },
      { name: "Infrastructure", count: 25, percentage: 10 },
    ],
    timestamp: new Date().toISOString(),
  });
}
