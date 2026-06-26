import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    services: {
      database: "ok",
      blockchain: "ok",
      ai: "mock",
    },
  });
}
