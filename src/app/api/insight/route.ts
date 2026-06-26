import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    insights: [
      {
        id: "ins_1",
        type: "trend",
        title: "User Growth Accelerating",
        description: "User registrations increased by 30% compared to last month",
        impact: "high",
        action: "Continue current marketing strategy",
      },
      {
        id: "ins_2",
        type: "opportunity",
        title: "DeFi Category Dominance",
        description: "DeFi campaigns have 48% higher success rate than other categories",
        impact: "medium",
        action: "Expand DeFi campaign offerings",
      },
      {
        id: "ins_3",
        type: "risk",
        title: "Retention Rate Declining",
        description: "User retention dropped from 82% to 78%",
        impact: "medium",
        action: "Improve onboarding and engagement",
      },
    ],
    total: 3,
    timestamp: new Date().toISOString(),
  });
}
