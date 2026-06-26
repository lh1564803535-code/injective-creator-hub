import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Dispute filed successfully",
    dispute: {
      id: "disp_" + Date.now(),
      status: "open",
      estimatedResolution: "48 hours",
    },
    timestamp: new Date().toISOString(),
  });
}

export async function GET() {
  return NextResponse.json({
    disputes: [
      {
        id: "disp_1",
        date: "2026-06-15",
        type: "reward",
        status: "resolved",
        resolution: "Reward credited",
      },
    ],
    total: 1,
    timestamp: new Date().toISOString(),
  });
}
