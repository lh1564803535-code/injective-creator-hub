import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    environment: {
      node: process.env.NODE_ENV || "development",
      runtime: "Node.js",
      version: process.version,
      platform: process.platform,
      arch: process.arch,
      env: {
        hasDatabase: !!process.env.DATABASE_URL,
        hasRedis: !!process.env.REDIS_URL,
        hasOpenAI: !!process.env.OPENAI_API_KEY,
        hasWalletConnect: !!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      },
    },
    timestamp: new Date().toISOString(),
  });
}
