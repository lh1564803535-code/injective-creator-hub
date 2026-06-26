import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    billing: {
      currentBalance: "1245.67 USDC",
      pendingCharges: "0 USDC",
      nextBillingDate: "2026-07-26",
      paymentMethod: "USDC Wallet",
      invoices: [
        {
          id: "inv_1",
          date: "2026-06-26",
          amount: "0 USDC",
          status: "paid",
          description: "Free Plan - June 2026",
        },
      ],
    },
    timestamp: new Date().toISOString(),
  });
}
