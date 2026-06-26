import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    risk: {
      overall: "low",
      categories: [
        {
          name: "Smart Contract",
          level: "low",
          score: 95,
          description: "Audited contracts with no critical vulnerabilities",
        },
        {
          name: "Operational",
          level: "low",
          score: 90,
          description: "Robust monitoring and incident response",
        },
        {
          name: "Financial",
          level: "medium",
          score: 75,
          description: "Market volatility exposure",
        },
        {
          name: "Regulatory",
          level: "low",
          score: 85,
          description: "Compliant with current regulations",
        },
      ],
      mitigations: [
        "Regular security audits",
        "Multi-sig treasury management",
        "Insurance coverage",
        "Emergency pause functionality",
      ],
    },
    timestamp: new Date().toISOString(),
  });
}
