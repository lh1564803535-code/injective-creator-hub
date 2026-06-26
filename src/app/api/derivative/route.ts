import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    derivative: {
      markets: [
        {
          symbol: "INJ/USDC:USDC",
          type: "perpetual",
          price: "24.85",
          fundingRate: "0.01%",
          openInterest: "$50M",
        },
        {
          symbol: "ETH/USDC:USDC",
          type: "perpetual",
          price: "3450.00",
          fundingRate: "0.005%",
          openInterest: "$200M",
        },
      ],
      totalOpenInterest: "$500M",
      totalVolume24h: "$250M",
    },
    timestamp: new Date().toISOString(),
  });
}
