/**
 * Twitter utilities (mock)
 */

export interface TwitterProfile {
  id: string;
  username: string;
  displayName: string;
  followers: number;
  following: number;
  tweets: number;
  verified?: boolean;
}

export interface TwitterStats {
  impressions: number;
  engagements: number;
  profileVisits: number;
  tweetsThisWeek?: number;
  mentionsThisWeek?: number;
  engagementRate?: number;
  growthRate?: number;
  impressionsChange?: number;
  profileVisitsChange?: number;
}

export interface Tweet {
  id: string;
  text: string;
  createdAt: number;
  likes: number;
  retweets: number;
}

export async function connectTwitter(): Promise<TwitterProfile | null> {
  // Mock implementation
  return null;
}

export async function getTwitterStats(_userId?: string): Promise<TwitterStats> {
  return {
    impressions: 0,
    engagements: 0,
    profileVisits: 0,
  };
}

export async function getRecentTweets(_userId?: string): Promise<Tweet[]> {
  return [];
}
