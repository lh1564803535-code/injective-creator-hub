import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    evm: {
      chainId: 1439,
      networkName: "Injective EVM Testnet",
      rpc: "https://k8s.testnet.json-rpc.injective.network/",
      explorer: "https://testnet.blockscout.injective.network/",
      blockTime: "1.2 seconds",
      finality: "instant",
      gasPrice: "0.001 INJ",
    },
    timestamp: new Date().toISOString(),
  });
}
