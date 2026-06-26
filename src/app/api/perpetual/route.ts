import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    perpetual: {
      markets: [
        {
          symbol: "INJ/USDC:USDC",
          price: "24.85",
          indexPrice: "24.84",
          markPrice: "24.86",
          fundingRate: "0.01%",
          openInterest: "$50M",
          volume24h: "$25M",
        },
        {
          symbol: "ETH/USDC:USDC",
          price: "3450.00",
          indexPrice: "3449.50",
          markPrice: "3450.50",
          fundingRate: "0.005%",
          openInterest: "$200M",
          volume24h: "$150M",
        },
      ],
      totalOpenInterest: "$500M",
      totalVolume24h: "$250M",
    },
    timestamp: new Date().toISOString(),
  });
}
