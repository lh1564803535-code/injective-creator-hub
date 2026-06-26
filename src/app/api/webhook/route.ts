import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Webhook registered successfully",
    webhookId: "wh_" + Date.now(),
    timestamp: new Date().toISOString(),
  });
}

export async function GET() {
  return NextResponse.json({
    webhooks: [
      {
        id: "wh_1",
        url: "https://example.com/webhook",
        events: ["vote", "claim", "submit"],
        status: "active",
      },
    ],
    total: 1,
    timestamp: new Date().toISOString(),
  });
}
