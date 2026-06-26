import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    scaling: {
      horizontal: {
        enabled: true,
        currentInstances: 3,
        maxInstances: 10,
        autoScaling: true,
      },
      vertical: {
        enabled: true,
        currentCPU: "2 cores",
        currentMemory: "4 GB",
        maxCPU: "8 cores",
        maxMemory: "16 GB",
      },
      database: {
        type: "PostgreSQL",
        replicas: 2,
        readReplicas: 3,
        connectionPooling: true,
      },
    },
    timestamp: new Date().toISOString(),
  });
}
