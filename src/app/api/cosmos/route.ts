import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    cosmos: {
      chainId: "injective-888",
      networkName: "Injective",
      rpc: "https://k8s.global.mainnet.rpc.injective.network/",
      rest: "https://k8s.global.mainnet.lcd.injective.network/",
      blockTime: "1.2 seconds",
      consensus: "Tendermint",
    },
    timestamp: new Date().toISOString(),
  });
}
