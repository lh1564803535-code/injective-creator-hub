import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Payment processed successfully",
    payment: {
      id: "pay_" + Date.now(),
      amount: "10 USDC",
      status: "confirmed",
      hash: "0x" + Math.random().toString(16).slice(2, 10) + "...",
    },
    timestamp: new Date().toISOString(),
  });
}

export async function GET() {
  return NextResponse.json({
    payments: [
      {
        id: "pay_1",
        date: "2026-06-26",
        amount: "10 USDC",
        status: "confirmed",
        description: "Pro Plan - June 2026",
      },
    ],
    total: 1,
    timestamp: new Date().toISOString(),
  });
}
