export interface Creator {
  address: string;
  name?: string;
  submissions: number;
  earnings: number;
}

export type LeaderboardSortBy = "earnings" | "submissions" | "votes";

export type CampaignStatus = 'active' | 'voting' | 'ended';

export interface Campaign {
  id: number;
  sponsor?: string;
  title: string;
  description: string;
  totalReward: number;
  deadline: number;
  submissionCount: number;
  settled: boolean;
}

export interface CampaignWithStatus extends Campaign {
  status: CampaignStatus;
  timeRemaining: string;
}

export interface CreateCampaignForm {
  title: string;
  description: string;
  reward: string;
  duration: string;
}

export interface Submission {
  id: number;
  campaignId: number;
  creator: string;
  contentURI: string;
  votes: number;
  reward: number;
  claimed: boolean;
}
