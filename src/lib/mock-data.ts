const now = Math.floor(Date.now() / 1000);

export const MOCK_CREATORS = [
  { address: "0x1234567890abcdef1234567890abcdef12345678", earnings: 2500, submissions: 12, totalVotes: 89 },
  { address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd", earnings: 1800, submissions: 8, totalVotes: 64 },
  { address: "0x7890abcdef1234567890abcdef1234567890abcde", earnings: 1200, submissions: 6, totalVotes: 45 },
  { address: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef", earnings: 900, submissions: 5, totalVotes: 32 },
  { address: "0x1111111111111111111111111111111111111111", earnings: 600, submissions: 3, totalVotes: 21 },
];

export const MOCK_CAMPAIGNS = [
  {
    id: 0,
    title: "发推赢 USDC — Injective Creator Bounty",
    description: "发一条关于 Injective 的推文，提交链接，社区评审，按贡献分 USDC 奖金。",
    totalReward: 100,
    deadline: now + 86400 * 5,
    submissionCount: 12,
    settled: false,
    sponsor: "0x1234567890abcdef1234567890abcdef12345678",
  },
  {
    id: 1,
    title: "Injective 生态深度解读",
    description: "写一篇关于 Injective DeFi 生态的推文长线程，最佳内容赢取 USDC。",
    totalReward: 250,
    deadline: now + 86400 * 3,
    submissionCount: 8,
    settled: false,
    sponsor: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
  },
  {
    id: 2,
    title: "为 Injective 创作 Meme",
    description: "创作最有趣的 Injective Meme，社区投票决定获胜者。",
    totalReward: 50,
    deadline: now - 86400,
    submissionCount: 23,
    settled: false,
    sponsor: "0x7890abcdef1234567890abcdef1234567890abcde",
  },
  {
    id: 3,
    title: "Injective 测试网教程",
    description: "制作一个 Injective 测试网使用视频教程，需要分步骤讲解。",
    totalReward: 500,
    deadline: now + 86400 * 14,
    submissionCount: 3,
    settled: false,
    sponsor: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
  },
  {
    id: 4,
    title: "每周 Injective 推广帖",
    description: "发布每周 Injective 最新动态和发展线程。",
    totalReward: 75,
    deadline: now - 86400 * 7,
    submissionCount: 15,
    settled: true,
    sponsor: "0x1111111111111111111111111111111111111111",
  },
];

export const MOCK_SUBMISSIONS: Record<number, { creator: string; votes: number }[]> = {
  0: [
    { creator: "0x1234567890abcdef1234567890abcdef12345678", votes: 15 },
    { creator: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd", votes: 10 },
    { creator: "0x7890abcdef1234567890abcdef1234567890abcde", votes: 7 },
  ],
  1: [
    { creator: "0x1234567890abcdef1234567890abcdef12345678", votes: 22 },
    { creator: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef", votes: 18 },
  ],
};

export const MOCK_ACTIVITY = [
  { id: "a1", type: "submission" as const, campaignId: 0, campaignTitle: "发推赢 USDC", timestamp: now - 300, detail: "New content submitted" },
  { id: "a2", type: "vote" as const, campaignId: 0, campaignTitle: "发推赢 USDC", timestamp: now - 900, detail: "4x vote cast" },
  { id: "a3", type: "submission" as const, campaignId: 1, campaignTitle: "Ecosystem Deep Dive", timestamp: now - 1800, detail: "Thread submitted" },
  { id: "a4", type: "vote" as const, campaignId: 1, campaignTitle: "Ecosystem Deep Dive", timestamp: now - 3600, detail: "5x vote cast" },
  { id: "a5", type: "settle" as const, campaignId: 4, campaignTitle: "Weekly Shill Thread", timestamp: now - 86400, detail: "Campaign settled" },
  { id: "a6", type: "claim" as const, campaignId: 4, campaignTitle: "Weekly Shill Thread", timestamp: now - 86000, detail: "Reward claimed" },
];
