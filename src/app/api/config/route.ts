import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    config: {
      network: {
        chainId: 1439,
        name: "Injective EVM Testnet",
        rpc: "https://k8s.testnet.json-rpc.injective.network/",
        explorer: "https://testnet.blockscout.injective.network/",
      },
      contracts: {
        bountyCampaign: "0x0000000000000000000000000000000000000000",
      },
      features: {
        aiAssistant: true,
        realTimeStreaming: true,
        transactionPreview: true,
        socialFi: true,
        mcpIntegration: true,
      },
    },
    timestamp: new Date().toISOString(),
  });
}
