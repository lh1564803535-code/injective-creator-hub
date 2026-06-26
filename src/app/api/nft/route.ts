import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    nft: {
      collections: [
        {
          name: "Creator Badges",
          totalSupply: 500,
          owners: 350,
          floorPrice: "5 USDC",
        },
        {
          name: "Achievement NFTs",
          totalSupply: 1000,
          owners: 750,
          floorPrice: "2 USDC",
        },
      ],
      totalVolume: "$25,000",
      totalSales: 1250,
    },
    timestamp: new Date().toISOString(),
  });
}
