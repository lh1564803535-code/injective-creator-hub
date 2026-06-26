// ---------------------------------------------------------------------------
// Reward Calculation Logic
// ---------------------------------------------------------------------------

export interface RewardEntry {
  address: string;
  votes: number;
  rank: number;
  reward: number; // USDC
}

export interface TransactionRecord {
  hash: string;
  timestamp: number;
  campaignId: number;
  entries: RewardEntry[];
  totalAmount: number;
  status: "pending" | "confirmed" | "failed";
}

// ---------------------------------------------------------------------------
// 1. Proportional Distribution (by vote share)
// ---------------------------------------------------------------------------

/**
 * Calculate rewards proportional to each participant's vote count.
 * @param participants - Array of { address, votes }
 * @param totalPool - Total USDC to distribute
 * @returns RewardEntry[] with calculated rewards
 */
export function calculateProportionalRewards(
  participants: { address: string; votes: number }[],
  totalPool: number
): RewardEntry[] {
  if (participants.length === 0 || totalPool <= 0) return [];

  const totalVotes = participants.reduce((sum, p) => sum + p.votes, 0);
  if (totalVotes === 0) return participants.map((p, i) => ({
    ...p,
    rank: i + 1,
    reward: 0,
  }));

  // Sort by votes descending for ranking
  const sorted = [...participants].sort((a, b) => b.votes - a.votes);

  return sorted.map((p, i) => ({
    address: p.address,
    votes: p.votes,
    rank: i + 1,
    reward: Math.round((p.votes / totalVotes) * totalPool * 100) / 100,
  }));
}

// ---------------------------------------------------------------------------
// 2. Rank-Based Distribution (fixed percentages)
// ---------------------------------------------------------------------------

/**
 * Default rank percentages: 1st=50%, 2nd=30%, 3rd=20%
 */
const DEFAULT_RANK_PERCENTAGES: Record<number, number> = {
  1: 0.5,
  2: 0.3,
  3: 0.2,
};

/**
 * Calculate rewards based on ranking with fixed percentage splits.
 * @param participants - Array of { address, votes }
 * @param totalPool - Total USDC to distribute
 * @param rankPercentages - Optional custom percentages (defaults to 50/30/20)
 * @returns RewardEntry[] with calculated rewards
 */
export function calculateRankingRewards(
  participants: { address: string; votes: number }[],
  totalPool: number,
  rankPercentages: Record<number, number> = DEFAULT_RANK_PERCENTAGES
): RewardEntry[] {
  if (participants.length === 0 || totalPool <= 0) return [];

  // Sort by votes descending
  const sorted = [...participants].sort((a, b) => b.votes - a.votes);

  return sorted.map((p, i) => {
    const rank = i + 1;
    const percentage = rankPercentages[rank] ?? 0;
    return {
      address: p.address,
      votes: p.votes,
      rank,
      reward: Math.round(totalPool * percentage * 100) / 100,
    };
  });
}

// ---------------------------------------------------------------------------
// 3. Batch Distribute (Mock blockchain tx)
// ---------------------------------------------------------------------------

/**
 * Simulate batch reward distribution via blockchain.
 * In production, this would call Injective smart contract.
 * @param campaignId - The campaign identifier
 * @param entries - Reward entries to distribute
 * @returns TransactionRecord with mock tx hash
 */
export async function batchDistributeRewards(
  campaignId: number,
  entries: RewardEntry[]
): Promise<TransactionRecord> {
  // Validate
  const validEntries = entries.filter((e) => e.reward > 0);
  if (validEntries.length === 0) {
    throw new Error("No valid entries to distribute");
  }

  // Simulate blockchain delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Generate mock tx hash
  const hash =
    "0x" +
    Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

  const totalAmount = validEntries.reduce((sum, e) => sum + e.reward, 0);

  return {
    hash,
    timestamp: Date.now(),
    campaignId,
    entries: validEntries,
    totalAmount: Math.round(totalAmount * 100) / 100,
    status: "confirmed",
  };
}

// ---------------------------------------------------------------------------
// 4. Transaction Ledger
// ---------------------------------------------------------------------------

const transactionLedger: TransactionRecord[] = [];

/**
 * Record a transaction in the ledger.
 */
export function recordTransaction(record: TransactionRecord): void {
  transactionLedger.push(record);
}

/**
 * Get all transactions for a campaign.
 */
export function getTransactionsForCampaign(campaignId: number): TransactionRecord[] {
  return transactionLedger.filter((r) => r.campaignId === campaignId);
}

/**
 * Get all transactions in the ledger.
 */
export function getAllTransactions(): TransactionRecord[] {
  return [...transactionLedger];
}

/**
 * Get total distributed amount across all campaigns.
 */
export function getTotalDistributed(): number {
  return transactionLedger
    .filter((r) => r.status === "confirmed")
    .reduce((sum, r) => sum + r.totalAmount, 0);
}

// ---------------------------------------------------------------------------
// 5. Utility: Full distribution workflow
// ---------------------------------------------------------------------------

/**
 * Complete distribution workflow: calculate + distribute + record.
 * @param campaignId - The campaign identifier
 * @param participants - Array of { address, votes }
 * @param totalPool - Total USDC to distribute
 * @param mode - "proportional" or "ranking"
 * @returns TransactionRecord
 */
export async function executeRewardDistribution(
  campaignId: number,
  participants: { address: string; votes: number }[],
  totalPool: number,
  mode: "proportional" | "ranking" = "proportional"
): Promise<TransactionRecord> {
  const entries =
    mode === "proportional"
      ? calculateProportionalRewards(participants, totalPool)
      : calculateRankingRewards(participants, totalPool);

  const txRecord = await batchDistributeRewards(campaignId, entries);
  recordTransaction(txRecord);

  return txRecord;
}
