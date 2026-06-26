import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    report: {
      period: "June 2026",
      summary: {
        totalUsers: 156,
        activeUsers: 89,
        newUsers: 36,
        totalEarnings: 124567.89,
        averageEarnings: 798.51,
        campaignsCompleted: 42,
        successRate: "95%",
      },
      highlights: [
        "30% user growth month-over-month",
        "27% revenue increase",
        "95% campaign success rate",
        "78% user retention rate",
      ],
      recommendations: [
        "Increase marketing budget for user acquisition",
        "Add more campaign categories",
        "Improve onboarding flow",
        "Enhance AI assistant capabilities",
      ],
    },
    timestamp: new Date().toISOString(),
  });
}
