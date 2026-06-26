import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    monitoring: {
      alerts: {
        active: 0,
        resolved: 5,
        total: 5,
      },
      metrics: {
        cpu: "45%",
        memory: "60%",
        disk: "35%",
        network: "2.5 Gbps",
      },
      logs: {
        errors: 2,
        warnings: 15,
        info: 1250,
        total: 1267,
      },
    },
    timestamp: new Date().toISOString(),
  });
}
