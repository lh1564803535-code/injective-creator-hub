import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Refund requested successfully",
    refund: {
      id: "ref_" + Date.now(),
      amount: "10 USDC",
      status: "pending",
      estimatedTime: "3-5 business days",
    },
    timestamp: new Date().toISOString(),
  });
}

export async function GET() {
  return NextResponse.json({
    refunds: [
      {
        id: "ref_1",
        date: "2026-06-20",
        amount: "5 USDC",
        status: "completed",
        reason: "Campaign cancelled",
      },
    ],
    total: 1,
    timestamp: new Date().toISOString(),
  });
}
