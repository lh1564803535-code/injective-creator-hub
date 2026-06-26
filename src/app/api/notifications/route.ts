import { NextResponse } from "next/server";

const MOCK_NOTIFICATIONS = [
  {
    id: "notif_1",
    type: "reward",
    title: "Reward Claimed!",
    detail: "You received 50 USDC from DeFi Content Challenge",
    timestamp: Date.now() - 3600000,
    read: false,
  },
  {
    id: "notif_2",
    type: "vote",
    title: "New Vote",
    detail: "Your submission received a 5-star vote",
    timestamp: Date.now() - 7200000,
    read: true,
  },
  {
    id: "notif_3",
    type: "deadline",
    title: "Campaign Ending Soon",
    detail: "NFT Art Showcase ends in 24 hours",
    timestamp: Date.now() - 86400000,
    read: true,
  },
];

export async function GET() {
  return NextResponse.json({
    notifications: MOCK_NOTIFICATIONS,
    total: MOCK_NOTIFICATIONS.length,
    unread: MOCK_NOTIFICATIONS.filter((n) => !n.read).length,
    timestamp: new Date().toISOString(),
  });
}
