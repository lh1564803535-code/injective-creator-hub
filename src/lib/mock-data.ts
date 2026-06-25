/**
 * Mock Data for Injective Creator Hub
 * Used for development and demo purposes
 */

import type { Creator } from '@/types/creator-settlement'
import type { CampaignData, SubmissionData } from '@/lib/injective'
import type { Address } from 'viem'

// ---------------------------------------------------------------------------
// Mock Creators (10)
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
]

// ---------------------------------------------------------------------------
// Mock Campaigns (5)
// ---------------------------------------------------------------------------

export const MOCK_CAMPAIGNS: CampaignData[] = [
  {
    id: 1,
    sponsor: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e' as Address,
    title: 'XHunt Content Sprint',
    description: 'Create viral content about Injective\'s XHunt ecosystem. Best content wins USDC prizes.',
    totalReward: BigInt(5000000000), // 5000 USDC
    deadline: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days from now
    submissionCount: 23,
    settled: false,
  },
  {
    id: 2,
    sponsor: '0x87a85adfb17ee947143d10d69cfed086010d0834' as Address,
    title: 'DeFi Tutorial Challenge',
    description: 'Write tutorials explaining Injective\'s unique DeFi features for newcomers.',
    totalReward: BigInt(2000000000), // 2000 USDC
    deadline: Math.floor(Date.now() / 1000) + 86400 * 3, // 3 days from now
    submissionCount: 15,
    settled: false,
  },
  {
    id: 3,
    sponsor: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as Address,
    title: 'Meme Contest #42',
    description: 'Funniest Injective meme wins! Community votes decide the winner.',
    totalReward: BigInt(1000000000), // 1000 USDC
    deadline: Math.floor(Date.now() / 1000) + 86400 * 14, // 14 days from now
    submissionCount: 67,
    settled: false,
  },
  {
    id: 4,
    sponsor: '0x1234567890abcdef1234567890abcdef12345678' as Address,
    title: 'Build on Injective Hackathon',
    description: 'Build innovative dApps on Injective EVM. Top 3 projects split the prize pool.',
    totalReward: BigInt(10000000000), // 10000 USDC
    deadline: Math.floor(Date.now() / 1000) + 86400 * 30, // 30 days from now
    submissionCount: 8,
    settled: false,
  },
  {
    id: 5,
    sponsor: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' as Address,
    title: 'Community Art Drop',
    description: 'Create digital art inspired by Injective\'s vision of decentralized finance.',
    totalReward: BigInt(3000000000), // 3000 USDC
    deadline: Math.floor(Date.now() / 1000) - 86400 * 2, // Ended 2 days ago
    submissionCount: 31,
    settled: true,
  },
]

// ---------------------------------------------------------------------------
// Mock Submissions (per campaign)
// ---------------------------------------------------------------------------

export const MOCK_SUBMISSIONS: Record<number, SubmissionData[]> = {
  1: [
    {
      id: 1,
      campaignId: 1,
      creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e' as Address,
      contentURI: 'https://twitter.com/user/status/101',
      votes: 42,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 2,
      campaignId: 1,
      creator: '0x87a85adfb17ee947143d10d69cfed086010d0834' as Address,
      contentURI: 'https://youtube.com/watch?v=abc1',
      votes: 28,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 3,
      campaignId: 1,
      creator: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as Address,
      contentURI: 'https://medium.com/@user/article-1',
      votes: 15,
      reward: BigInt(0),
      claimed: false,
    },
  ],
  2: [
    {
      id: 4,
      campaignId: 2,
      creator: '0x1234567890abcdef1234567890abcdef12345678' as Address,
      contentURI: 'https://medium.com/@user/defi-tutorial-1',
      votes: 35,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 5,
      campaignId: 2,
      creator: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' as Address,
      contentURI: 'https://medium.com/@user/defi-tutorial-2',
      votes: 22,
      reward: BigInt(0),
      claimed: false,
    },
  ],
  3: [
    {
      id: 6,
      campaignId: 3,
      creator: '0x9876543210fedcba9876543210fedcba98765432' as Address,
      contentURI: 'https://imgur.com/meme-1',
      votes: 89,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 7,
      campaignId: 3,
      creator: '0xfedcba9876543210fedcba9876543210fedcba98' as Address,
      contentURI: 'https://imgur.com/meme-2',
      votes: 67,
      reward: BigInt(0),
      claimed: false,
    },
    {
      id: 8,
      campaignId: 3,
      creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e' as Address,
      contentURI: 'https://imgur.com/meme-3',
      votes: 45,
      reward: BigInt(0),
      claimed: false,
    },
  ],
  4: [
    {
      id: 9,
      campaignId: 4,
      creator: '0x87a85adfb17ee947143d10d69cfed086010d0834' as Address,
      contentURI: 'https://github.com/user/dapp-1',
      votes: 12,
      reward: BigInt(0),
      claimed: false,
    },
  ],
  5: [
    {
      id: 10,
      campaignId: 5,
      creator: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as Address,
      contentURI: 'https://opensea.io/art-1',
      votes: 120,
      reward: BigInt(1500000000),
      claimed: true,
    },
    {
      id: 11,
      campaignId: 5,
      creator: '0x1234567890abcdef1234567890abcdef12345678' as Address,
      contentURI: 'https://opensea.io/art-2',
      votes: 95,
      reward: BigInt(900000000),
      claimed: true,
    },
    {
      id: 12,
      campaignId: 5,
      creator: '0xaaaa1111bbbb2222cccc3333dddd4444eeee5555' as Address,
      contentURI: 'https://opensea.io/art-3',
      votes: 78,
      reward: BigInt(600000000),
      claimed: false,
    },
  ],
}
