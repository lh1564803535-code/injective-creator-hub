import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    wasm: {
      contracts: 250,
      codeIds: 100,
      totalExecutions: 1250000,
      averageGas: "0.001 INJ",
      status: "active",
    },
    timestamp: new Date().toISOString(),
  });
}
