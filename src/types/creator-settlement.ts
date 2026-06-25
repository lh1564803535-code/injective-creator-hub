/**
 * Creator Hub Type Definitions
 * Types for campaigns, submissions, and creator leaderboard
 */

// ---------------------------------------------------------------------------
// Campaign Types
// ---------------------------------------------------------------------------

export interface Campaign {
  id: number
  sponsor: string
  title: string
  description: string
  totalReward: bigint
  deadline: number
  submissionCount: number
  settled: boolean
}

export type CampaignStatus = 'active' | 'voting' | 'ended'

export interface CampaignWithStatus extends Campaign {
  status: CampaignStatus
  timeRemaining: string
}

// ---------------------------------------------------------------------------
// Submission Types
// ---------------------------------------------------------------------------

export interface Submission {
  id: number
  campaignId: number
  creator: string
  contentURI: string
  votes: number
  reward: bigint
  claimed: boolean
}

// ---------------------------------------------------------------------------
// Creator / Leaderboard Types
// ---------------------------------------------------------------------------

export interface Creator {
  address: string
  totalSubmissions: number
  totalVotes: number
  totalEarnings: bigint
  rank: number
}

export type LeaderboardSortBy = 'earnings' | 'votes' | 'submissions'

export interface LeaderboardFilters {
  sortBy: LeaderboardSortBy
  search?: string
  limit: number
}

// ---------------------------------------------------------------------------
// Animation Types
// ---------------------------------------------------------------------------

export interface RewardAnimationState {
  isAnimating: boolean
  targetAmount: number
  currentAmount: number
  creatorAddress: string
}

// ---------------------------------------------------------------------------
// Form Types
// ---------------------------------------------------------------------------

export interface CreateCampaignForm {
  title: string
  description: string
  totalReward: string // USDC amount as string
  duration: number // seconds
}

export interface SubmitContentForm {
  campaignId: number
  contentURI: string
}

export interface VoteForm {
  submissionId: number
  weight: number // 1-5
}

// ---------------------------------------------------------------------------
// API Response Types
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// ---------------------------------------------------------------------------
// Utility Types
// ---------------------------------------------------------------------------

export type Address = `0x${string}`

export interface TokenAmount {
  value: bigint
  decimals: number
  symbol: string
}
