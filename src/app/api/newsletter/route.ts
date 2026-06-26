import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Subscribed to newsletter successfully",
    subscriberId: "sub_" + Date.now(),
    timestamp: new Date().toISOString(),
  });
}

export async function GET() {
  return NextResponse.json({
    newsletter: {
      subscribers: 5000,
      openRate: "45%",
      clickRate: "12%",
      lastSent: "2026-06-25",
    },
    timestamp: new Date().toISOString(),
  });
}
