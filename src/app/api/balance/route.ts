import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    balance: {
      inj: "125.50",
      usdc: "1245.67",
      usdt: "500.00",
    },
    totalUsd: "2870.17",
    timestamp: new Date().toISOString(),
  });
}
