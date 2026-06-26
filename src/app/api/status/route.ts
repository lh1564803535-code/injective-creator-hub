import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "operational",
    services: {
      api: "operational",
      blockchain: "operational",
      ai: "operational",
      database: "operational",
    },
    uptime: "99.9%",
    lastIncident: null,
    timestamp: new Date().toISOString(),
  });
}
