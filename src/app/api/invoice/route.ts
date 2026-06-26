import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    invoices: [
      {
        id: "inv_1",
        date: "2026-06-26",
        amount: "0 USDC",
        status: "paid",
        description: "Free Plan - June 2026",
        downloadUrl: "#",
      },
      {
        id: "inv_2",
        date: "2026-05-26",
        amount: "0 USDC",
        status: "paid",
        description: "Free Plan - May 2026",
        downloadUrl: "#",
      },
    ],
    total: 2,
    timestamp: new Date().toISOString(),
  });
}
