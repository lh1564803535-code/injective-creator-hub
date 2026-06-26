import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    spot: {
      markets: [
        {
          symbol: "INJ/USDC",
          price: "24.85",
          change24h: "+3.2%",
          volume24h: "$1.2M",
          high24h: "25.10",
          low24h: "23.50",
        },
        {
          symbol: "ETH/USDC",
          price: "3450.00",
          change24h: "+1.5%",
          volume24h: "$5.8M",
          high24h: "3500.00",
          low24h: "3400.00",
        },
      ],
      totalVolume24h: "$12.5M",
      totalMarkets: 156,
    },
    timestamp: new Date().toISOString(),
  });
}
