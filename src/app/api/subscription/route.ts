import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    subscription: {
      plans: [
        {
          name: "Free",
          price: "0 USDC",
          features: ["Basic campaigns", "Community voting", "Standard rewards"],
        },
        {
          name: "Pro",
          price: "10 USDC/month",
          features: ["Unlimited campaigns", "Priority support", "Advanced analytics", "Custom branding"],
        },
        {
          name: "Enterprise",
          price: "Custom",
          features: ["White-label", "Dedicated support", "API access", "Custom integrations"],
        },
      ],
      currentPlan: "Free",
    },
    timestamp: new Date().toISOString(),
  });
}
