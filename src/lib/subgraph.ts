/**
 * Subgraph utilities
 */

interface SubgraphQuery {
  query: string;
  variables?: Record<string, unknown>;
}

interface SubgraphResponse<T = unknown> {
  data?: T;
  errors?: Array<{ message: string }>;
}

class SubgraphClient {
  private endpoint: string;
  private headers: Record<string, string>;

  constructor(endpoint: string, headers: Record<string, string> = {}) {
    this.endpoint = endpoint;
    this.headers = {
      "Content-Type": "application/json",
      ...headers,
    };
  }

  async query<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Subgraph query failed: ${response.statusText}`);
    }

    const result: SubgraphResponse<T> = await response.json();

    if (result.errors?.length) {
      throw new Error(`Subgraph errors: ${result.errors.map((e) => e.message).join(", ")}`);
    }

    if (!result.data) {
      throw new Error("Subgraph returned no data");
    }

    return result.data;
  }

  async fetchEntities<T>(
    entity: string,
    options?: {
      first?: number;
      skip?: number;
      orderBy?: string;
      orderDirection?: "asc" | "desc";
      where?: Record<string, unknown>;
    }
  ): Promise<T[]> {
    const { first = 100, skip = 0, orderBy, orderDirection = "desc", where } = options || {};

    let whereClause = "";
    if (where && Object.keys(where).length > 0) {
      const conditions = Object.entries(where)
        .map(([key, value]) => {
          if (typeof value === "string") return `${key}: "${value}"`;
          return `${key}: ${value}`;
        })
        .join(", ");
      whereClause = `where: { ${conditions} }`;
    }

    let orderClause = "";
    if (orderBy) {
      orderClause = `orderBy: ${orderBy}, orderDirection: ${orderDirection}`;
    }

    const query = `
      {
        ${entity}s(first: ${first}, skip: ${skip}${orderClause ? `, ${orderClause}` : ""}${whereClause ? `, ${whereClause}` : ""}) {
          id
        }
      }
    `;

    const result = await this.query<Record<string, T[]>>(query);
    return result[`${entity}s`] || [];
  }

  getEndpoint(): string {
    return this.endpoint;
  }

  setEndpoint(endpoint: string): void {
    this.endpoint = endpoint;
  }

  setHeader(key: string, value: string): void {
    this.headers[key] = value;
  }
}

export function createSubgraphClient(endpoint: string, headers?: Record<string, string>): SubgraphClient {
  return new SubgraphClient(endpoint, headers);
}

// Injective subgraph endpoints
export const INJECTIVE_SUBGRAPHS = {
  TESTNET: "https://api.studio.thegraph.com/query/injective/injective-testnet/version/latest",
  MAINNET: "https://api.studio.thegraph.com/query/injective/injective-mainnet/version/latest",
} as const;

// Global subgraph client
let globalSubgraphClient: SubgraphClient | null = null;

export function getGlobalSubgraphClient(): SubgraphClient {
  if (!globalSubgraphClient) {
    globalSubgraphClient = createSubgraphClient(INJECTIVE_SUBGRAPHS.TESTNET);
  }
  return globalSubgraphClient;
}

export function setGlobalSubgraphClient(client: SubgraphClient): void {
  globalSubgraphClient = client;
}

// Convenience functions
export async function subgraphQuery<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  return getGlobalSubgraphClient().query<T>(query, variables);
}

export async function fetchSubgraphEntities<T>(
  entity: string,
  options?: Parameters<SubgraphClient["fetchEntities"]>[1]
): Promise<T[]> {
  return getGlobalSubgraphClient().fetchEntities<T>(entity, options);
}

// Common subgraph queries
export const SUBGRAPH_QUERIES = {
  CAMPAIGNS: `
    query GetCampaigns($first: Int!, $skip: Int!) {
      campaigns(first: $first, skip: $skip, orderBy: createdAt, orderDirection: desc) {
        id
        title
        description
        totalReward
        deadline
        submissionCount
        settled
        sponsor
        createdAt
      }
    }
  `,
  SUBMISSIONS: `
    query GetSubmissions($campaignId: ID!, $first: Int!) {
      submissions(where: { campaign: $campaignId }, first: $first, orderBy: votes, orderDirection: desc) {
        id
        creator
        contentHash
        votes
        claimed
        createdAt
      }
    }
  `,
  CREATORS: `
    query GetCreators($first: Int!, $skip: Int!) {
      creators(first: $first, skip: $skip, orderBy: totalEarnings, orderDirection: desc) {
        id
        address
        totalEarnings
        totalVotes
        totalSubmissions
      }
    }
  `,
} as const;
