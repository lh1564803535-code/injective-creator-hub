import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    auth: {
      method: "Wallet-based",
      providers: ["MetaMask", "WalletConnect", "RainbowKit"],
      session: {
        type: "JWT",
        expiry: "24 hours",
        refresh: true,
      },
      security: {
        mfa: "optional",
        rateLimit: "100 requests/minute",
        bruteForceProtection: true,
      },
    },
    timestamp: new Date().toISOString(),
  });
}
