"use client";

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { BOUNTY_CAMPAIGN_ADDRESS, BOUNTY_CAMPAIGN_ABI } from "@/lib/contract-abi";

// Types matching the contract structs
export interface CampaignData {
  id: number;
  sponsor: string;
  title: string;
  description: string;
  totalReward: bigint;
  deadline: number;
  submissionCount: number;
  settled: boolean;
}

export interface SubmissionData {
  id: number;
  campaignId: number;
  creator: `0x${string}`;
  contentURI: string;
  votes: number;
  reward: bigint;
  claimed: boolean;
}

// Read hooks
export function useCampaignCount() {
  return useReadContract({
    address: BOUNTY_CAMPAIGN_ADDRESS,
    abi: BOUNTY_CAMPAIGN_ABI,
    functionName: "campaignCount",
  });
}

export function useSubmissionCount() {
  return useReadContract({
    address: BOUNTY_CAMPAIGN_ADDRESS,
    abi: BOUNTY_CAMPAIGN_ABI,
    functionName: "submissionCount",
  });
}

export function useCampaign(campaignId: number) {
  return useReadContract({
    address: BOUNTY_CAMPAIGN_ADDRESS,
    abi: BOUNTY_CAMPAIGN_ABI,
    functionName: "getCampaign",
    args: [BigInt(campaignId)],
  });
}

export function useCampaignSubmissionIds(campaignId: number) {
  return useReadContract({
    address: BOUNTY_CAMPAIGN_ADDRESS,
    abi: BOUNTY_CAMPAIGN_ABI,
    functionName: "getCampaignSubmissions",
    args: [BigInt(campaignId)],
  });
}

export function useSubmission(submissionId: number) {
  return useReadContract({
    address: BOUNTY_CAMPAIGN_ADDRESS,
    abi: BOUNTY_CAMPAIGN_ABI,
    functionName: "getSubmission",
    args: [BigInt(submissionId)],
    query: { enabled: submissionId >= 0 },
  });
}

export function useHasVoted(address: `0x${string}` | undefined, submissionId: number) {
  return useReadContract({
    address: BOUNTY_CAMPAIGN_ADDRESS,
    abi: BOUNTY_CAMPAIGN_ABI,
    functionName: "hasVoted",
    args: address ? [address, BigInt(submissionId)] : undefined,
    query: { enabled: !!address },
  });
}

// Write hooks
export function useCreateCampaign() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createCampaign = async (
    title: string,
    description: string,
    totalRewardUSDC: string,
    durationDays: number
  ) => {
    const rewardWei = parseUnits(totalRewardUSDC, 6); // USDC has 6 decimals
    const durationSeconds = BigInt(durationDays * 86400);

    writeContract({
      address: BOUNTY_CAMPAIGN_ADDRESS,
      abi: BOUNTY_CAMPAIGN_ABI,
      functionName: "createCampaign",
      args: [title, description, rewardWei, durationSeconds],
    });
  };

  return { createCampaign, hash, isPending, isConfirming, isSuccess, error };
}

export function useSubmitContent() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const submit = (campaignId: number, contentURI: string) => {
    writeContract({
      address: BOUNTY_CAMPAIGN_ADDRESS,
      abi: BOUNTY_CAMPAIGN_ABI,
      functionName: "submit",
      args: [BigInt(campaignId), contentURI],
    });
  };

  return { submit, hash, isPending, isConfirming, isSuccess, error };
}

export function useVote() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const vote = (submissionId: number, weight: number) => {
    if (weight < 1 || weight > 5) throw new Error("Weight must be 1-5");
    writeContract({
      address: BOUNTY_CAMPAIGN_ADDRESS,
      abi: BOUNTY_CAMPAIGN_ABI,
      functionName: "vote",
      args: [BigInt(submissionId), BigInt(weight)],
    });
  };

  return { vote, hash, isPending, isConfirming, isSuccess, error };
}

export function useSettle() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const settle = (campaignId: number) => {
    writeContract({
      address: BOUNTY_CAMPAIGN_ADDRESS,
      abi: BOUNTY_CAMPAIGN_ABI,
      functionName: "settle",
      args: [BigInt(campaignId)],
    });
  };

  return { settle, hash, isPending, isConfirming, isSuccess, error };
}

export function useClaimReward() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claimReward = (submissionId: number) => {
    writeContract({
      address: BOUNTY_CAMPAIGN_ADDRESS,
      abi: BOUNTY_CAMPAIGN_ABI,
      functionName: "claimReward",
      args: [BigInt(submissionId)],
    });
  };

  return { claimReward, hash, isPending, isConfirming, isSuccess, error };
}

// Helper to format USDC amounts
export function formatUSDC(value: bigint): string {
  return formatUnits(value, 6);
}

export function parseUSDC(value: string): bigint {
  return parseUnits(value, 6);
}
