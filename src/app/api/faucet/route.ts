import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    faucets: [
      {
        name: "Official Faucet",
        url: "https://testnet.faucet.injective.network/",
        description: "Connect wallet and claim testnet INJ + USDT",
      },
      {
        name: "Google Cloud Faucet",
        url: "https://cloud.google.com/application/web3/faucet/injective/testnet",
        description: "Google Cloud Web3 faucet for Injective testnet",
      },
      {
        name: "Bware Labs Faucet",
        url: "https://bwarelabs.com/faucets/injective-testnet",
        description: "Tweet to unlock extra claims",
      },
    ],
    network: {
      chainId: 1439,
      name: "Injective EVM Testnet",
    },
    timestamp: new Date().toISOString(),
  });
}
