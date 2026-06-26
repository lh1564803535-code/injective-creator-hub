// Twitter OAuth + 社交数据（Mock 版本，Demo 用）

export interface TwitterProfile {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  followers: number
  following: number
  tweets: number
  verified: boolean
}

export interface TwitterStats {
  tweetsThisWeek: number
  mentionsThisWeek: number
  engagementRate: number
  topTweet: string
  growthRate: number
}

// Mock 的 Twitter OAuth 流程
export async function connectTwitter(): Promise<TwitterProfile> {
  // 模拟 OAuth 跳转延迟
  await new Promise(resolve => setTimeout(resolve, 1500))

  return {
    id: '123456789',
    username: 'creator_demo',
    displayName: '创作者演示',
    avatarUrl: '',
    followers: 12500,
    following: 380,
    tweets: 1250,
    verified: true
  }
}

// Mock 的社交数据
export async function getTwitterStats(userId: string): Promise<TwitterStats> {
  return {
    tweetsThisWeek: 12,
    mentionsThisWeek: 45,
    engagementRate: 4.8,
    topTweet: 'Just joined the Injective Creator Hub! 🚀',
    growthRate: 15.2
  }
}

// Mock 的推文列表
export async function getRecentTweets(userId: string) {
  return [
    { id: '1', text: 'Just submitted my artwork to the Injective contest! 🎨', likes: 128, retweets: 32, date: '2026-06-25' },
    { id: '2', text: 'Real-time earnings are amazing - watching my USDC grow every second 💰', likes: 256, retweets: 64, date: '2026-06-24' },
    { id: '3', text: 'The AI assistant helped me create a wallet in 2 minutes. No blockchain knowledge needed! 🤖', likes: 89, retweets: 21, date: '2026-06-23' },
  ]
}
