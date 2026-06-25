/**
 * Mock Data for Injective Creator Hub
 * Used for development and demo purposes
 */

import type { Creator } from '@/types/creator-settlement'
import type { CampaignData, SubmissionData } from '@/lib/injective'
import type { Address } from 'viem'

const now = Math.floor(Date.now() / 1000)

// ---------------------------------------------------------------------------
// Mock Creators (15)
// ---------------------------------------------------------------------------

export const MOCK_CREATORS: Creator[] = [
  {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e',
    totalEarnings: BigInt(4500000000), // 4500 USDC
    totalVotes: 156,
    totalSubmissions: 12,
    rank: 1,
  },
  {
    address: '0x87a85adfb17ee947143d10d69cfed086010d0834',
    totalEarnings: BigInt(2800000000), // 2800 USDC
    totalVotes: 98,
    totalSubmissions: 8,
    rank: 2,
  },
  {
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    totalEarnings: BigInt(1500000000), // 1500 USDC
    totalVotes: 67,
    totalSubmissions: 6,
    rank: 3,
  },
  {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    totalEarnings: BigInt(800000000), // 800 USDC
    totalVotes: 45,
    totalSubmissions: 5,
    rank: 4,
  },
  {
    address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    totalEarnings: BigInt(500000000), // 500 USDC
    totalVotes: 32,
    totalSubmissions: 3,
    rank: 5,
  },
  {
    address: '0x9876543210fedcba9876543210fedcba98765432',
    totalEarnings: BigInt(350000000), // 350 USDC
    totalVotes: 28,
    totalSubmissions: 4,
    rank: 6,
  },
  {
    address: '0xfedcba9876543210fedcba9876543210fedcba98',
    totalEarnings: BigInt(200000000), // 200 USDC
    totalVotes: 19,
    totalSubmissions: 2,
    rank: 7,
  },
  {
    address: '0xaaaa1111bbbb2222cccc3333dddd4444eeee5555',
    totalEarnings: BigInt(150000000), // 150 USDC
    totalVotes: 14,
    totalSubmissions: 3,
    rank: 8,
  },
  {
    address: '0xbbbb2222cccc3333dddd4444eeee5555ffff6666',
    totalEarnings: BigInt(100000000), // 100 USDC
    totalVotes: 10,
    totalSubmissions: 2,
    rank: 9,
  },
  {
    address: '0xcccc3333dddd4444eeee5555ffff6666aaaa7777',
    totalEarnings: BigInt(50000000), // 50 USDC
    totalVotes: 5,
    totalSubmissions: 1,
    rank: 10,
  },
  // --- 5 new creators ---
  {
    address: '0xdddd4444eeee5555ffff6666aaaa7777bbbb8888',
    totalEarnings: BigInt(3200000000), // 3200 USDC
    totalVotes: 130,
    totalSubmissions: 10,
    rank: 2,
  },
  {
    address: '0xeeee5555ffff6666aaaa7777bbbb8888cccc9999',
    totalEarnings: BigInt(1100000000), // 1100 USDC
    totalVotes: 55,
    totalSubmissions: 7,
    rank: 4,
  },
  {
    address: '0xffff6666aaaa7777bbbb8888cccc9999dddd0000',
    totalEarnings: BigInt(650000000), // 650 USDC
    totalVotes: 38,
    totalSubmissions: 5,
    rank: 5,
  },
  {
    address: '0x1111aaaabbbb2222cccc3333dddd4444eeee5555',
    totalEarnings: BigInt(420000000), // 420 USDC
    totalVotes: 25,
    totalSubmissions: 4,
    rank: 6,
  },
  {
    address: '0x2222bbbbcccc3333dddd4444eeee5555ffff6666',
    totalEarnings: BigInt(180000000), // 180 USDC
    totalVotes: 12,
    totalSubmissions: 3,
    rank: 9,
  },
]

// ---------------------------------------------------------------------------
// Mock Campaigns (8)
// ---------------------------------------------------------------------------

export const MOCK_CAMPAIGNS: CampaignData[] = [
  // --- Active campaigns ---
  {
    id: 1,
    sponsor: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e' as Address,
    title: 'XHunt Content Sprint',
    description: 'Create viral content about Injective\'s XHunt ecosystem. Best content wins USDC prizes.',
    totalReward: BigInt(5000000000), // 5000 USDC
    deadline: now + 86400 * 7, // 7 days from now
    submissionCount: 23,
    settled: false,
  },
  {
    id: 2,
    sponsor: '0x87a85adfb17ee947143d10d69cfed086010d0834' as Address,
    title: 'DeFi Tutorial Challenge',
    description: 'Write tutorials explaining Injective\'s unique DeFi features for newcomers.',
    totalReward: BigInt(2000000000), // 2000 USDC
    deadline: now + 86400 * 3, // 3 days from now
    submissionCount: 15,
    settled: false,
  },
  {
    id: 3,
    sponsor: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as Address,
    title: 'Meme Contest #42',
    description: 'Funniest Injective meme wins! Community votes decide the winner.',
    totalReward: BigInt(1000000000), // 1000 USDC
    deadline: now + 86400 * 14, // 14 days from now
    submissionCount: 67,
    settled: false,
  },
  {
    id: 4,
    sponsor: '0x1234567890abcdef1234567890abcdef12345678' as Address,
    title: 'Build on Injective Hackathon',
    description: 'Build innovative dApps on Injective EVM. Top 3 projects split the prize pool.',
    totalReward: BigInt(10000000000), // 10000 USDC
    deadline: now + 86400 * 30, // 30 days from now
    submissionCount: 8,
    settled: false,
  },
  // --- Voting phase (deadline passed, not settled) ---
  {
    id: 5,
    sponsor: '0xdddd4444eeee5555ffff6666aaaa7777bbbb8888' as Address,
    title: 'Trading Strategy Showcase',
    description: 'Share your best Injective perpetuals trading strategy. Community votes for the most profitable approach.',
    totalReward: BigInt(3000000000), // 3000 USDC
    deadline: now - 86400 * 1, // ended 1 day ago
    submissionCount: 42,
    settled: false,
  },
  {
    id: 6,
    sponsor: '0xeeee5555ffff6666aaaa7777bbbb8888cccc9999' as Address,
    title: 'Institutional DeFi Deep Dive',
    description: 'Write in-depth analysis of institutional DeFi adoption on Injective. Must include data and charts.',
    totalReward: BigInt(1500000000), // 1500 USDC
    deadline: now - 86400 * 3, // ended 3 days ago
    submissionCount: 28,
    settled: false,
  },
  // --- Settled campaigns ---
  {
    id: 7,
    sponsor: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' as Address,
    title: 'Community Art Drop',
    description: 'Create digital art inspired by Injective\'s vision of decentralized finance.',
    totalReward: BigInt(3000000000), // 3000 USDC
    deadline: now - 86400 * 10, // ended 10 days ago
    submissionCount: 31,
    settled: true,
  },
  {
    id: 8,
    sponsor: '0xffff6666aaaa7777bbbb8888cccc9999dddd0000' as Address,
    title: 'DEX UI Redesign Sprint',
    description: 'Redesign the Injective DEX interface. Best UX/UI design wins the grand prize.',
    totalReward: BigInt(7500000000), // 7500 USDC
    deadline: now - 86400 * 20, // ended 20 days ago
    submissionCount: 55,
    settled: true,
  },
]

// ---------------------------------------------------------------------------
// Mock Submissions (5-8 per campaign)
// ---------------------------------------------------------------------------

export const MOCK_SUBMISSIONS: Record<number, SubmissionData[]> = {
  // Campaign 1: XHunt Content Sprint (active, 6 submissions)
  1: [
    {
      id: 1,
      campaignId: 1,
      creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e' as Address,
      contentURI: 'https://twitter.com/user/status/101',
      votes: 142,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 2,
      campaignId: 1,
      creator: '0x87a85adfb17ee947143d10d69cfed086010d0834' as Address,
      contentURI: 'https://youtube.com/watch?v=abc1',
      votes: 98,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 3,
      campaignId: 1,
      creator: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as Address,
      contentURI: 'https://medium.com/@user/article-1',
      votes: 76,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 13,
      campaignId: 1,
      creator: '0xdddd4444eeee5555ffff6666aaaa7777bbbb8888' as Address,
      contentURI: 'https://twitter.com/user/status/102',
      votes: 210,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 14,
      campaignId: 1,
      creator: '0xeeee5555ffff6666aaaa7777bbbb8888cccc9999' as Address,
      contentURI: 'https://youtube.com/watch?v=def2',
      votes: 55,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 15,
      campaignId: 1,
      creator: '0x1111aaaabbbb2222cccc3333dddd4444eeee5555' as Address,
      contentURI: 'https://medium.com/@user/xhunt-deep-dive',
      votes: 38,
      reward: BigInt(0),
      claimed: false,
    },
  ],
  // Campaign 2: DeFi Tutorial Challenge (active, 5 submissions)
  2: [
    {
      id: 4,
      campaignId: 2,
      creator: '0x1234567890abcdef1234567890abcdef12345678' as Address,
      contentURI: 'https://medium.com/@user/defi-tutorial-1',
      votes: 135,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 5,
      campaignId: 2,
      creator: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' as Address,
      contentURI: 'https://medium.com/@user/defi-tutorial-2',
      votes: 82,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 16,
      campaignId: 2,
      creator: '0xffff6666aaaa7777bbbb8888cccc9999dddd0000' as Address,
      contentURI: 'https://mirror.xyz/user/defi-guide',
      votes: 67,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 17,
      campaignId: 2,
      creator: '0x2222bbbbcccc3333dddd4444eeee5555ffff6666' as Address,
      contentURI: 'https://medium.com/@user/amm-explained',
      votes: 45,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 18,
      campaignId: 2,
      creator: '0xbbbb2222cccc3333dddd4444eeee5555ffff6666' as Address,
      contentURI: 'https://mirror.xyz/user/yield-farming',
      votes: 28,
      reward: BigInt(0),
      claimed: false,
    },
  ],
  // Campaign 3: Meme Contest #42 (active, 8 submissions)
  3: [
    {
      id: 6,
      campaignId: 3,
      creator: '0x9876543210fedcba9876543210fedcba98765432' as Address,
      contentURI: 'https://imgur.com/meme-1',
      votes: 389,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 7,
      campaignId: 3,
      creator: '0xfedcba9876543210fedcba9876543210fedcba98' as Address,
      contentURI: 'https://imgur.com/meme-2',
      votes: 267,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 8,
      campaignId: 3,
      creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e' as Address,
      contentURI: 'https://imgur.com/meme-3',
      votes: 195,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 19,
      campaignId: 3,
      creator: '0xdddd4444eeee5555ffff6666aaaa7777bbbb8888' as Address,
      contentURI: 'https://imgur.com/meme-4',
      votes: 152,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 20,
      campaignId: 3,
      creator: '0xaaaa1111bbbb2222cccc3333dddd4444eeee5555' as Address,
      contentURI: 'https://imgur.com/meme-5',
      votes: 118,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 21,
      campaignId: 3,
      creator: '0xcccc3333dddd4444eeee5555ffff6666aaaa7777' as Address,
      contentURI: 'https://imgur.com/meme-6',
      votes: 87,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 22,
      campaignId: 3,
      creator: '0x1111aaaabbbb2222cccc3333dddd4444eeee5555' as Address,
      contentURI: 'https://imgur.com/meme-7',
      votes: 64,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 23,
      campaignId: 3,
      creator: '0x2222bbbbcccc3333dddd4444eeee5555ffff6666' as Address,
      contentURI: 'https://imgur.com/meme-8',
      votes: 41,
      reward: BigInt(0),
      claimed: false,
    },
  ],
  // Campaign 4: Hackathon (active, 5 submissions)
  4: [
    {
      id: 9,
      campaignId: 4,
      creator: '0x87a85adfb17ee947143d10d69cfed086010d0834' as Address,
      contentURI: 'https://github.com/user/dapp-1',
      votes: 42,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 24,
      campaignId: 4,
      creator: '0xdddd4444eeee5555ffff6666aaaa7777bbbb8888' as Address,
      contentURI: 'https://github.com/user/dex-aggregator',
      votes: 58,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 25,
      campaignId: 4,
      creator: '0xeeee5555ffff6666aaaa7777bbbb8888cccc9999' as Address,
      contentURI: 'https://github.com/user/nft-marketplace',
      votes: 35,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 26,
      campaignId: 4,
      creator: '0xffff6666aaaa7777bbbb8888cccc9999dddd0000' as Address,
      contentURI: 'https://github.com/user/bridge-ui',
      votes: 27,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 27,
      campaignId: 4,
      creator: '0x1111aaaabbbb2222cccc3333dddd4444eeee5555' as Address,
      contentURI: 'https://github.com/user/portfolio-tracker',
      votes: 19,
      reward: BigInt(0),
      claimed: false,
    },
  ],
  // Campaign 5: Trading Strategy Showcase (voting phase, 7 submissions)
  5: [
    {
      id: 28,
      campaignId: 5,
      creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e' as Address,
      contentURI: 'https://medium.com/@user/grid-bot-strategy',
      votes: 487,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 29,
      campaignId: 5,
      creator: '0xdddd4444eeee5555ffff6666aaaa7777bbbb8888' as Address,
      contentURI: 'https://medium.com/@user/dca-perps',
      votes: 356,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 30,
      campaignId: 5,
      creator: '0x87a85adfb17ee947143d10d69cfed086010d0834' as Address,
      contentURI: 'https://mirror.xyz/user/momentum-strategy',
      votes: 278,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 31,
      campaignId: 5,
      creator: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as Address,
      contentURI: 'https://medium.com/@user/funding-rate-arb',
      votes: 195,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 32,
      campaignId: 5,
      creator: '0xeeee5555ffff6666aaaa7777bbbb8888cccc9999' as Address,
      contentURI: 'https://mirror.xyz/user/volatility-play',
      votes: 142,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 33,
      campaignId: 5,
      creator: '0x1234567890abcdef1234567890abcdef12345678' as Address,
      contentURI: 'https://medium.com/@user/mean-reversion',
      votes: 88,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 34,
      campaignId: 5,
      creator: '0xffff6666aaaa7777bbbb8888cccc9999dddd0000' as Address,
      contentURI: 'https://mirror.xyz/user/breakout-scalping',
      votes: 64,
      reward: BigInt(0),
      claimed: false,
    },
  ],
  // Campaign 6: Institutional DeFi Deep Dive (voting phase, 6 submissions)
  6: [
    {
      id: 35,
      campaignId: 6,
      creator: '0xdddd4444eeee5555ffff6666aaaa7777bbbb8888' as Address,
      contentURI: 'https://medium.com/@user/institutional-report',
      votes: 312,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 36,
      campaignId: 6,
      creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e' as Address,
      contentURI: 'https://mirror.xyz/user/tvl-analysis',
      votes: 245,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 37,
      campaignId: 6,
      creator: '0x87a85adfb17ee947143d10d69cfed086010d0834' as Address,
      contentURI: 'https://medium.com/@user/defi-adoption-curve',
      votes: 178,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 38,
      campaignId: 6,
      creator: '0xeeee5555ffff6666aaaa7777bbbb8888cccc9999' as Address,
      contentURI: 'https://mirror.xyz/user/risk-framework',
      votes: 134,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 39,
      campaignId: 6,
      creator: '0x1234567890abcdef1234567890abcdef12345678' as Address,
      contentURI: 'https://medium.com/@user/composability-deep-dive',
      votes: 96,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 40,
      campaignId: 6,
      creator: '0x1111aaaabbbb2222cccc3333dddd4444eeee5555' as Address,
      contentURI: 'https://mirror.xyz/user/institutional-custody',
      votes: 62,
      reward: BigInt(0),
      claimed: false,
    },
  ],
  // Campaign 7: Community Art Drop (settled, 6 submissions with rewards)
  7: [
    {
      id: 10,
      campaignId: 7,
      creator: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as Address,
      contentURI: 'https://opensea.io/art-1',
      votes: 320,
      reward: BigInt(1200000000), // 1200 USDC
      claimed: true,
    },
    {
      id: 11,
      campaignId: 7,
      creator: '0x1234567890abcdef1234567890abcdef12345678' as Address,
      contentURI: 'https://opensea.io/art-2',
      votes: 245,
      reward: BigInt(900000000), // 900 USDC
      claimed: true,
    },
    {
      id: 12,
      campaignId: 7,
      creator: '0xaaaa1111bbbb2222cccc3333dddd4444eeee5555' as Address,
      contentURI: 'https://opensea.io/art-3',
      votes: 178,
      reward: BigInt(600000000), // 600 USDC
      claimed: true,
    },
    {
      id: 41,
      campaignId: 7,
      creator: '0xdddd4444eeee5555ffff6666aaaa7777bbbb8888' as Address,
      contentURI: 'https://opensea.io/art-4',
      votes: 132,
      reward: BigInt(300000000), // 300 USDC
      claimed: false,
    },
    {
      id: 42,
      campaignId: 7,
      creator: '0x9876543210fedcba9876543210fedcba98765432' as Address,
      contentURI: 'https://opensea.io/art-5',
      votes: 87,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 43,
      campaignId: 7,
      creator: '0x2222bbbbcccc3333dddd4444eeee5555ffff6666' as Address,
      contentURI: 'https://opensea.io/art-6',
      votes: 45,
      reward: BigInt(0),
      claimed: false,
    },
  ],
  // Campaign 8: DEX UI Redesign (settled, 7 submissions with rewards)
  8: [
    {
      id: 44,
      campaignId: 8,
      creator: '0xdddd4444eeee5555ffff6666aaaa7777bbbb8888' as Address,
      contentURI: 'https://figma.com/file/dex-redesign-1',
      votes: 456,
      reward: BigInt(3000000000), // 3000 USDC
      claimed: true,
    },
    {
      id: 45,
      campaignId: 8,
      creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e' as Address,
      contentURI: 'https://figma.com/file/dex-redesign-2',
      votes: 378,
      reward: BigInt(2250000000), // 2250 USDC
      claimed: true,
    },
    {
      id: 46,
      campaignId: 8,
      creator: '0xeeee5555ffff6666aaaa7777bbbb8888cccc9999' as Address,
      contentURI: 'https://figma.com/file/dex-redesign-3',
      votes: 289,
      reward: BigInt(1500000000), // 1500 USDC
      claimed: true,
    },
    {
      id: 47,
      campaignId: 8,
      creator: '0x87a85adfb17ee947143d10d69cfed086010d0834' as Address,
      contentURI: 'https://figma.com/file/dex-redesign-4',
      votes: 198,
      reward: BigInt(750000000), // 750 USDC
      claimed: false,
    },
    {
      id: 48,
      campaignId: 8,
      creator: '0xffff6666aaaa7777bbbb8888cccc9999dddd0000' as Address,
      contentURI: 'https://figma.com/file/dex-redesign-5',
      votes: 145,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 49,
      campaignId: 8,
      creator: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as Address,
      contentURI: 'https://figma.com/file/dex-redesign-6',
      votes: 98,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 50,
      campaignId: 8,
      creator: '0x1111aaaabbbb2222cccc3333dddd4444eeee5555' as Address,
      contentURI: 'https://figma.com/file/dex-redesign-7',
      votes: 52,
      reward: BigInt(0),
      claimed: false,
    },
  ],
}

// ---------------------------------------------------------------------------
// Mock Recent Activity (for homepage feed)
// ---------------------------------------------------------------------------

export interface ActivityItem {
  id: number
  type: 'submission' | 'vote' | 'settle' | 'claim'
  creator: string
  campaignTitle: string
  campaignId: number
  timestamp: number // unix seconds
  detail?: string
}

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: 1,
    type: 'submission',
    creator: '0xdddd4444eeee5555ffff6666aaaa7777bbbb8888',
    campaignTitle: 'XHunt Content Sprint',
    campaignId: 1,
    timestamp: now - 1800, // 30 min ago
    detail: 'Submitted a new Twitter thread',
  },
  {
    id: 2,
    type: 'vote',
    creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e',
    campaignTitle: 'Trading Strategy Showcase',
    campaignId: 5,
    timestamp: now - 3600, // 1 hour ago
    detail: 'Voted 3x weight on grid-bot-strategy',
  },
  {
    id: 3,
    type: 'submission',
    creator: '0x1111aaaabbbb2222cccc3333dddd4444eeee5555',
    campaignTitle: 'Meme Contest #42',
    campaignId: 3,
    timestamp: now - 7200, // 2 hours ago
    detail: 'Submitted meme-7',
  },
  {
    id: 4,
    type: 'settle',
    creator: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    campaignTitle: 'Community Art Drop',
    campaignId: 7,
    timestamp: now - 86400 * 8, // 8 days ago
    detail: 'Campaign settled, 3000 USDC distributed',
  },
  {
    id: 5,
    type: 'claim',
    creator: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    campaignTitle: 'Community Art Drop',
    campaignId: 7,
    timestamp: now - 86400 * 7, // 7 days ago
    detail: 'Claimed 1200 USDC reward',
  },
  {
    id: 6,
    type: 'vote',
    creator: '0x87a85adfb17ee947143d10d69cfed086010d0834',
    campaignTitle: 'Institutional DeFi Deep Dive',
    campaignId: 6,
    timestamp: now - 86400 * 2, // 2 days ago
    detail: 'Voted 5x weight on institutional-report',
  },
  {
    id: 7,
    type: 'submission',
    creator: '0x2222bbbbcccc3333dddd4444eeee5555ffff6666',
    campaignTitle: 'DeFi Tutorial Challenge',
    campaignId: 2,
    timestamp: now - 86400, // 1 day ago
    detail: 'Submitted amm-explained tutorial',
  },
  {
    id: 8,
    type: 'settle',
    creator: '0xffff6666aaaa7777bbbb8888cccc9999dddd0000',
    campaignTitle: 'DEX UI Redesign Sprint',
    campaignId: 8,
    timestamp: now - 86400 * 18, // 18 days ago
    detail: 'Campaign settled, 7500 USDC distributed',
  },
  {
    id: 9,
    type: 'claim',
    creator: '0xdddd4444eeee5555ffff6666aaaa7777bbbb8888',
    campaignTitle: 'DEX UI Redesign Sprint',
    campaignId: 8,
    timestamp: now - 86400 * 17, // 17 days ago
    detail: 'Claimed 3000 USDC reward',
  },
  {
    id: 10,
    type: 'vote',
    creator: '0x1234567890abcdef1234567890abcdef12345678',
    campaignTitle: 'Build on Injective Hackathon',
    campaignId: 4,
    timestamp: now - 43200, // 12 hours ago
    detail: 'Voted 4x weight on dex-aggregator',
  },
  {
    id: 11,
    type: 'submission',
    creator: '0xeeee5555ffff6666aaaa7777bbbb8888cccc9999',
    campaignTitle: 'XHunt Content Sprint',
    campaignId: 1,
    timestamp: now - 14400, // 4 hours ago
    detail: 'Submitted a YouTube deep dive',
  },
  {
    id: 12,
    type: 'vote',
    creator: '0x9876543210fedcba9876543210fedcba98765432',
    campaignTitle: 'Meme Contest #42',
    campaignId: 3,
    timestamp: now - 10800, // 3 hours ago
    detail: 'Voted 2x weight on meme-3',
  },
]
