/**
 * Insight utilities
 */

interface Insight {
  id: string;
  type: "info" | "warning" | "opportunity" | "risk";
  title: string;
  description: string;
  confidence: number; // 0-100
  timestamp: number;
  metadata?: Record<string, unknown>;
}

class InsightEngine {
  private insights: Insight[] = [];
  private generators: Array<() => Promise<Insight[]>> = [];
  private listeners: Set<(insights: Insight[]) => void> = new Set();

  addGenerator(generator: () => Promise<Insight[]>): void {
    this.generators.push(generator);
  }

  async generate(): Promise<Insight[]> {
    const allInsights: Insight[] = [];

    for (const generator of this.generators) {
      try {
        const insights = await generator();
        allInsights.push(...insights);
      } catch (error) {
        console.error("Error generating insights:", error);
      }
    }

    // Sort by confidence and timestamp
    allInsights.sort((a, b) => {
      if (a.confidence !== b.confidence) {
        return b.confidence - a.confidence;
      }
      return b.timestamp - a.timestamp;
    });

    this.insights = allInsights;
    this.notify();
    return allInsights;
  }

  getInsights(): Insight[] {
    return [...this.insights];
  }

  getByType(type: Insight["type"]): Insight[] {
    return this.insights.filter((i) => i.type === type);
  }

  getTop(n: number): Insight[] {
    return this.insights.slice(0, n);
  }

  subscribe(listener: (insights: Insight[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getInsights());
      } catch (error) {
        console.error("Error in insight listener:", error);
      }
    });
  }

  clear(): void {
    this.insights = [];
    this.generators = [];
  }
}

export function createInsightEngine(): InsightEngine {
  return new InsightEngine();
}

export function createInsight(
  type: Insight["type"],
  title: string,
  description: string,
  confidence: number,
  metadata?: Record<string, unknown>
): Insight {
  return {
    id: crypto.randomUUID(),
    type,
    title,
    description,
    confidence,
    timestamp: Date.now(),
    metadata,
  };
}

// Insight generators
export function createEarningsInsight(
  currentEarnings: number,
  previousEarnings: number
): Insight {
  const change = ((currentEarnings - previousEarnings) / previousEarnings) * 100;

  if (change > 20) {
    return createInsight(
      "opportunity",
      "Earnings Growth Acceleration",
      `Your earnings increased by ${change.toFixed(1)}% compared to last period. Consider increasing your activity to maximize this trend.`,
      85
    );
  }

  if (change < -10) {
    return createInsight(
      "warning",
      "Earnings Decline Detected",
      `Your earnings decreased by ${Math.abs(change).toFixed(1)}% compared to last period. Review your recent activity and consider diversifying your submissions.`,
      75
    );
  }

  return createInsight(
    "info",
    "Stable Earnings",
    "Your earnings are stable. Keep up your current activity level.",
    90
  );
}

export function createCampaignInsight(
  activeCampaigns: number,
  endingSoon: number
): Insight[] {
  const insights: Insight[] = [];

  if (endingSoon > 0) {
    insights.push(createInsight(
      "opportunity",
      "Campaigns Ending Soon",
      `${endingSoon} campaign(s) ending within 24 hours. Submit your work now to earn rewards.`,
      95
    ));
  }

  if (activeCampaigns > 5) {
    insights.push(createInsight(
      "info",
      "Many Active Campaigns",
      `${activeCampaigns} campaigns are currently active. Focus on the ones that match your skills.`,
      80
    ));
  }

  return insights;
}

export function createReputationInsight(score: number): Insight {
  if (score >= 80) {
    return createInsight(
      "opportunity",
      "High Reputation Score",
      `Your reputation score of ${score} qualifies you for premium campaigns. Keep up the great work!`,
      90
    );
  }

  if (score < 50) {
    return createInsight(
      "warning",
      "Low Reputation Score",
      `Your reputation score is ${score}. Participate in more campaigns and maintain consistency to improve.`,
      70
    );
  }

  return createInsight(
    "info",
    "Growing Reputation",
    `Your reputation score is ${score}. Continue participating to unlock more opportunities.`,
    80
  );
}

// Global insight engine
let globalInsightEngine: InsightEngine | null = null;

export function getGlobalInsightEngine(): InsightEngine {
  if (!globalInsightEngine) {
    globalInsightEngine = createInsightEngine();
  }
  return globalInsightEngine;
}

export function setGlobalInsightEngine(engine: InsightEngine): void {
  globalInsightEngine = engine;
}

// Convenience functions
export function addInsightGenerator(generator: () => Promise<Insight[]>): void {
  getGlobalInsightEngine().addGenerator(generator);
}

export async function generateInsights(): Promise<Insight[]> {
  return getGlobalInsightEngine().generate();
}

export function getInsights(): Insight[] {
  return getGlobalInsightEngine().getInsights();
}

export function getInsightsByType(type: Insight["type"]): Insight[] {
  return getGlobalInsightEngine().getByType(type);
}

export function getTopInsights(n: number): Insight[] {
  return getGlobalInsightEngine().getTop(n);
}
