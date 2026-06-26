import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    capacity: {
      current: {
        users: 156,
        campaigns: 42,
        transactions: 12500,
        storage: "2.5 GB",
      },
      limits: {
        users: 10000,
        campaigns: 1000,
        transactions: 1000000,
        storage: "100 GB",
      },
      utilization: {
        users: "1.56%",
        campaigns: "4.2%",
        transactions: "1.25%",
        storage: "2.5%",
      },
    },
    timestamp: new Date().toISOString(),
  });
}
