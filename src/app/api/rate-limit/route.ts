import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    rateLimit: {
      global: {
        requests: 1000,
        window: "1 minute",
        status: "active",
      },
      perUser: {
        requests: 100,
        window: "1 minute",
        status: "active",
      },
      perIP: {
        requests: 50,
        window: "1 minute",
        status: "active",
      },
    },
    timestamp: new Date().toISOString(),
  });
}
