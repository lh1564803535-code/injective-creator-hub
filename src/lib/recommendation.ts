/**
 * Recommendation utilities
 */

interface Recommendation {
  id: string;
  type: "campaign" | "action" | "optimization" | "learning";
  title: string;
  description: string;
  priority: number; // 1-10
  confidence: number; // 0-100
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  metadata?: Record<string, unknown>;
}

class RecommendationEngine {
  private recommendations: Recommendation[] = [];
  private generators: Array<() => Promise<Recommendation[]>> = [];
  private listeners: Set<(recommendations: Recommendation[]) => void> = new Set();

  addGenerator(generator: () => Promise<Recommendation[]>): void {
    this.generators.push(generator);
  }

  async generate(): Promise<Recommendation[]> {
    const allRecommendations: Recommendation[] = [];

    for (const generator of this.generators) {
      try {
        const recommendations = await generator();
        allRecommendations.push(...recommendations);
      } catch (error) {
        console.error("Error generating recommendations:", error);
      }
    }

    // Sort by priority and confidence
    allRecommendations.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return b.confidence - a.confidence;
    });

    this.recommendations = allRecommendations;
    this.notify();
    return allRecommendations;
  }

  getRecommendations(): Recommendation[] {
    return [...this.recommendations];
  }

  getByType(type: Recommendation["type"]): Recommendation[] {
    return this.recommendations.filter((r) => r.type === type);
  }

  getTop(n: number): Recommendation[] {
    return this.recommendations.slice(0, n);
  }

  subscribe(listener: (recommendations: Recommendation[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getRecommendations());
      } catch (error) {
        console.error("Error in recommendation listener:", error);
      }
    });
  }

  clear(): void {
    this.recommendations = [];
    this.generators = [];
  }
}

export function createRecommendationEngine(): RecommendationEngine {
  return new RecommendationEngine();
}

export function createRecommendation(
  type: Recommendation["type"],
  title: string,
  description: string,
  priority: number,
  confidence: number,
  action?: Recommendation["action"],
  metadata?: Record<string, unknown>
): Recommendation {
  return {
    id: crypto.randomUUID(),
    type,
    title,
    description,
    priority,
    confidence,
    action,
    metadata,
  };
}

// Recommendation generators
export function createCampaignRecommendation(
  campaign: { id: string; title: string; reward: number; daysLeft: number }
): Recommendation {
  return createRecommendation(
    "campaign",
    `Join: ${campaign.title}`,
    `Earn up to $${campaign.reward} USDC. ${campaign.daysLeft} days remaining.`,
    campaign.daysLeft <= 3 ? 9 : 7,
    85,
    {
      label: "View Campaign",
      href: `/campaign/${campaign.id}`,
    }
  );
}

export function createActionRecommendation(
  title: string,
  description: string,
  action: Recommendation["action"]
): Recommendation {
  return createRecommendation(
    "action",
    title,
    description,
    8,
    90,
    action
  );
}

export function createOptimizationRecommendation(
  title: string,
  description: string
): Recommendation {
  return createRecommendation(
    "optimization",
    title,
    description,
    6,
    75
  );
}

export function createLearningRecommendation(
  title: string,
  description: string,
  action?: Recommendation["action"]
): Recommendation {
  return createRecommendation(
    "learning",
    title,
    description,
    5,
    80,
    action
  );
}

// Global recommendation engine
let globalRecommendationEngine: RecommendationEngine | null = null;

export function getGlobalRecommendationEngine(): RecommendationEngine {
  if (!globalRecommendationEngine) {
    globalRecommendationEngine = createRecommendationEngine();
  }
  return globalRecommendationEngine;
}

export function setGlobalRecommendationEngine(engine: RecommendationEngine): void {
  globalRecommendationEngine = engine;
}

// Convenience functions
export function addRecommendationGenerator(generator: () => Promise<Recommendation[]>): void {
  getGlobalRecommendationEngine().addGenerator(generator);
}

export async function generateRecommendations(): Promise<Recommendation[]> {
  return getGlobalRecommendationEngine().generate();
}

export function getRecommendations(): Recommendation[] {
  return getGlobalRecommendationEngine().getRecommendations();
}

export function getRecommendationsByType(type: Recommendation["type"]): Recommendation[] {
  return getGlobalRecommendationEngine().getByType(type);
}

export function getTopRecommendations(n: number): Recommendation[] {
  return getGlobalRecommendationEngine().getTop(n);
}
