import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    compliance: {
      kyc: {
        required: false,
        status: "optional",
        description: "KYC is optional for basic platform usage",
      },
      aml: {
        required: true,
        status: "compliant",
        description: "Anti-money laundering checks in place",
      },
      dataProtection: {
        required: true,
        status: "compliant",
        description: "GDPR and data protection measures implemented",
      },
      sanctions: {
        required: true,
        status: "compliant",
        description: "OFAC sanctions screening enabled",
      },
    },
    timestamp: new Date().toISOString(),
  });
}
