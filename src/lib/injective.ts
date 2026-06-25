/**
 * Injective Creator Hub - Blockchain Integration Layer
 *
 * Uses viem to interact with Injective EVM chain.
 * No @injectivelabs/sdk-ts dependencies.
 */

import { createPublicClient, http, parseAbi, formatUnits, type Address } from 'viem'

// ---------------------------------------------------------------------------
// Chain Configuration
// ---------------------------------------------------------------------------

const INJECTIVE_CHAIN_ID = Number(process.env.NEXT_PUBLIC_INJECTIVE_CHAIN_ID || 2525)
const RPC_URL = process.env.NEXT_PUBLIC_INJECTIVE_RPC || 'https://k8s.global.mainnet.lcd.injective.network'

export const injectiveChain = {
  id: INJECTIVE_CHAIN_ID,
  name: 'Injective',
  nativeCurrency: {
    name: 'INJ',
    symbol: 'INJ',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [RPC_URL],
    },
  },
} as const

// ---------------------------------------------------------------------------
// Public Client
// ---------------------------------------------------------------------------

export const publicClient = createPublicClient({
  chain: injectiveChain,
  transport: http(RPC_URL),
})

// ---------------------------------------------------------------------------
// BountyCampaign Contract ABI
// ---------------------------------------------------------------------------

export const BOUNTY_ABI = parseAbi([
  'function campaignCount() view returns (uint256)',
  'function submissionCount() view returns (uint256)',
  'function getCampaign(uint256 campaignId) view returns (uint256, address, string, string, uint256, uint256, uint256, bool)',
  'function getSubmission(uint256 submissionId) view returns (uint256, uint256, address, string, uint256, uint256, bool)',
  'function getCampaignSubmissions(uint256 campaignId) view returns (uint256[])',
  'function getCreatorSubmissions(address creator) view returns (uint256[])',
  'function createCampaign(string title, string description, uint256 totalReward, uint256 duration) payable',
  'function submit(uint256 campaignId, string contentURI)',
  'function vote(uint256 submissionId, uint256 weight)',
  'function settle(uint256 campaignId)',
  'function claimReward(uint256 submissionId)',
  'event CampaignCreated(uint256 indexed campaignId, address indexed sponsor, uint256 totalReward)',
  'event SubmissionMade(uint256 indexed campaignId, uint256 indexed submissionId, address indexed creator)',
  'event Voted(uint256 indexed submissionId, address indexed voter, uint256 weight)',
  'event Settled(uint256 indexed campaignId, uint256 totalDistributed)',
  'event RewardClaimed(uint256 indexed submissionId, address indexed creator, uint256 amount)',
])

// Contract address from environment
export const BOUNTY_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_BOUNTY_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000') as Address

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CampaignData {
  id: number
  sponsor: Address
  title: string
  description: string
  totalReward: bigint
  deadline: number
  submissionCount: number
  settled: boolean
}

export interface SubmissionData {
  id: number
  campaignId: number
  creator: Address
  contentURI: string
  votes: number
  reward: bigint
  claimed: boolean
}

// ---------------------------------------------------------------------------
// Read Functions
// ---------------------------------------------------------------------------

export async function getCampaignCount(): Promise<number> {
  const count = await publicClient.readContract({
    address: BOUNTY_CONTRACT_ADDRESS,
    abi: BOUNTY_ABI,
    functionName: 'campaignCount',
  })
  return Number(count)
}

export async function getSubmissionCount(): Promise<number> {
  const count = await publicClient.readContract({
    address: BOUNTY_CONTRACT_ADDRESS,
    abi: BOUNTY_ABI,
    functionName: 'submissionCount',
  })
  return Number(count)
}

export async function getCampaign(id: number): Promise<CampaignData> {
  const result = await publicClient.readContract({
    address: BOUNTY_CONTRACT_ADDRESS,
    abi: BOUNTY_ABI,
    functionName: 'getCampaign',
    args: [BigInt(id)],
  }) as unknown as [bigint, Address, string, string, bigint, bigint, bigint, boolean]
  return {
    id: Number(result[0]),
    sponsor: result[1],
    title: result[2],
    description: result[3],
    totalReward: result[4],
    deadline: Number(result[5]),
    submissionCount: Number(result[6]),
    settled: result[7],
  }
}

export async function getSubmission(id: number): Promise<SubmissionData> {
  const result = await publicClient.readContract({
    address: BOUNTY_CONTRACT_ADDRESS,
    abi: BOUNTY_ABI,
    functionName: 'getSubmission',
    args: [BigInt(id)],
  }) as unknown as [bigint, bigint, Address, string, bigint, bigint, boolean]
  return {
    id: Number(result[0]),
    campaignId: Number(result[1]),
    creator: result[2],
    contentURI: result[3],
    votes: Number(result[4]),
    reward: result[5],
    claimed: result[6],
  }
}

export async function getCampaignSubmissions(campaignId: number): Promise<number[]> {
  const ids = await publicClient.readContract({
    address: BOUNTY_CONTRACT_ADDRESS,
    abi: BOUNTY_ABI,
    functionName: 'getCampaignSubmissions',
    args: [BigInt(campaignId)],
  }) as unknown as bigint[]
  return ids.map(Number)
}

export async function getCreatorSubmissions(creator: Address): Promise<number[]> {
  const ids = await publicClient.readContract({
    address: BOUNTY_CONTRACT_ADDRESS,
    abi: BOUNTY_ABI,
    functionName: 'getCreatorSubmissions',
    args: [creator],
  }) as unknown as bigint[]
  return ids.map(Number)
}

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

export function formatUSDC(value: bigint): string {
  return formatUnits(value, 6)
}

export function formatINJ(value: bigint): string {
  return formatUnits(value, 18)
}

export function shortenAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function getCampaignStatus(deadline: number, settled: boolean): 'active' | 'voting' | 'ended' {
  const now = Math.floor(Date.now() / 1000)
  if (settled) return 'ended'
  if (now >= deadline) return 'voting'
  return 'active'
}

export function getTimeRemaining(deadline: number): string {
  const now = Math.floor(Date.now() / 1000)
  const remaining = deadline - now

  if (remaining <= 0) return 'Ended'

  const days = Math.floor(remaining / 86400)
  const hours = Math.floor((remaining % 86400) / 3600)
  const minutes = Math.floor((remaining % 3600) / 60)

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

// Fetch all campaigns
export async function getAllCampaigns(): Promise<CampaignData[]> {
  const count = await getCampaignCount()
  if (count === 0) return []

  const campaigns: CampaignData[] = []
  for (let i = 1; i <= count; i++) {
    try {
      const campaign = await getCampaign(i)
      campaigns.push(campaign)
    } catch (e) {
      console.error(`Failed to fetch campaign ${i}:`, e)
    }
  }
  return campaigns
}

// Fetch submissions for a campaign
export async function getSubmissionsForCampaign(campaignId: number): Promise<SubmissionData[]> {
  const ids = await getCampaignSubmissions(campaignId)
  if (ids.length === 0) return []

  const submissions: SubmissionData[] = []
  for (const id of ids) {
    try {
      const submission = await getSubmission(id)
      submissions.push(submission)
    } catch (e) {
      console.error(`Failed to fetch submission ${id}:`, e)
    }
  }
  return submissions
}
