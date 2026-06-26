import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    orderbook: {
      market: "INJ/USDC",
      bids: [
        { price: "24.80", quantity: "1000" },
        { price: "24.75", quantity: "2500" },
        { price: "24.70", quantity: "5000" },
      ],
      asks: [
        { price: "24.85", quantity: "800" },
        { price: "24.90", quantity: "1500" },
        { price: "24.95", quantity: "3000" },
      ],
      spread: "0.05",
      midPrice: "24.825",
    },
    timestamp: new Date().toISOString(),
  });
}
