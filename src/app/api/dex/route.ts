import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    dex: {
      name: "Injective DEX",
      status: "active",
      pairs: [
        {
          symbol: "INJ/USDC",
          price: "24.85",
          change24h: "+3.2%",
          volume24h: "$1.2M",
        },
        {
          symbol: "ETH/USDC",
          price: "3450.00",
          change24h: "+1.5%",
          volume24h: "$5.8M",
        },
      ],
      totalVolume24h: "$12.5M",
      totalPairs: 156,
    },
    timestamp: new Date().toISOString(),
  });
}
