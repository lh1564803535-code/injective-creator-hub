import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    gas: {
      vote: { gas: "0.001", usd: "0.02", speed: "instant" },
      submit: { gas: "0.002", usd: "0.04", speed: "instant" },
      claim: { gas: "0.001", usd: "0.02", speed: "instant" },
      transfer: { gas: "0.001", usd: "0.02", speed: "instant" },
      deploy: { gas: "0.05", usd: "1.00", speed: "~5s" },
    },
    comparison: {
      ethereum: "99% cheaper",
      polygon: "50% cheaper",
      arbitrum: "30% cheaper",
    },
    timestamp: new Date().toISOString(),
  });
}
