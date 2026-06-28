"use client";

import { useState } from "react";
import {useTranslations} from 'next-intl';
import {Link, useRouter} from '@/i18n/navigation';
import { ArrowLeft, Rocket, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId, useSwitchChain, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { CreateCampaignForm } from "@/components/campaign/CreateCampaignForm";
import { BOUNTY_CAMPAIGN_ADDRESS, BOUNTY_CAMPAIGN_ABI } from "@/lib/contract-abi";

// Testnet USDC address
const USDC_ADDRESS = "0xF22bede237A07E121B56d91A491EB7bCDfD1F590" as const;
const INJECTIVE_TESTNET_CHAIN_ID = 1439;

// Minimal ERC20 ABI for approve
const ERC20_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

type DemoStep = "idle" | "approving" | "confirming-approve" | "creating" | "confirming-create" | "done" | "error";

export default function CreateCampaignPage() {
  const t = useTranslations('campaign');
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const router = useRouter();

  // Demo flow state
  const [step, setStep] = useState<DemoStep>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Wagmi write hooks
  const { writeContract: writeApprove, data: approveHash, isPending: isApprovePending } = useWriteContract();
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({ hash: approveHash });

  const { writeContract: writeCreate, data: createHash, isPending: isCreatePending } = useWriteContract();
  const { isLoading: isCreateConfirming, isSuccess: isCreateSuccess } = useWaitForTransactionReceipt({ hash: createHash });

  // Track approve confirmation → trigger createCampaign
  const [approveConfirmed, setApproveConfirmed] = useState(false);

  // When approve tx confirms, call createCampaign
  if (isApproveSuccess && !approveConfirmed && step === "confirming-approve") {
    setApproveConfirmed(true);
    setStep("creating");
    writeCreate({
      address: BOUNTY_CAMPAIGN_ADDRESS,
      abi: BOUNTY_CAMPAIGN_ABI,
      functionName: "createCampaign",
      args: [
        "Welcome to Creator Hub",
        "Your first campaign — submit content and earn USDC",
        parseUnits("10", 6),  // 10 USDC
        BigInt(604800),        // 7 days
      ],
    });
  }

  // When create tx confirms, redirect
  if (isCreateSuccess && step === "confirming-create") {
    setStep("done");
    // Read campaignCount to get the new ID, then redirect
    // For now, redirect to campaign list
    setTimeout(() => router.push("/"), 2000);
  }

  const handleDemo = async () => {
    setErrorMsg("");

    // Step 0: Check wallet connection
    if (!isConnected) {
      // RainbowKit will handle this via ConnectButton
      return;
    }

    // Step 1: Switch to Injective Testnet if needed
    if (chainId !== INJECTIVE_TESTNET_CHAIN_ID) {
      try {
        await switchChain({ chainId: INJECTIVE_TESTNET_CHAIN_ID });
      } catch {
        setErrorMsg("Please switch to Injective Testnet (Chain ID 1439) in your wallet.");
        setStep("error");
        return;
      }
    }

    // Step 2: Approve USDC
    setStep("approving");
    try {
      writeApprove({
        address: USDC_ADDRESS,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [BOUNTY_CAMPAIGN_ADDRESS, parseUnits("10", 6)],
      });
      setStep("confirming-approve");
    } catch (e: any) {
      setErrorMsg(e?.message || "USDC approval failed. Please try again.");
      setStep("error");
    }
  };

  const getStepLabel = () => {
    switch (step) {
      case "approving": return "Approving USDC...";
      case "confirming-approve": return "Confirming approval...";
      case "creating": return "Creating campaign...";
      case "confirming-create": return "Confirming creation...";
      case "done": return "Done! Redirecting...";
      case "error": return "Error";
      default: return "🎯 Create Demo Campaign";
    }
  };

  const isLoading = ["approving", "confirming-approve", "creating", "confirming-create"].includes(step);

  return (
    <div className="min-h-screen bg-[#08080f] p-6 pt-22 lg:p-8 lg:pt-24">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> {t('backToHub')}
        </Link>

        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-white">
            {t('createCampaign')}
          </h1>
          <p className="text-gray-400">
            {t('launchBounty')}
          </p>
        </div>

        {/* Demo Campaign Button */}
        <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <h2 className="mb-2 text-lg font-semibold text-white">Quick Demo</h2>
          <p className="mb-4 text-sm text-gray-400">
            One click to create a demo campaign on Injective Testnet. Requires 10 testnet USDC.
          </p>

          {!isConnected ? (
            <ConnectButton />
          ) : step === "error" ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4" />
                {errorMsg}
              </div>
              <button
                onClick={() => { setStep("idle"); setErrorMsg(""); }}
                className="rounded-lg bg-white/[0.06] px-4 py-2 text-sm text-gray-300 hover:bg-white/[0.1]"
              >
                Retry
              </button>
            </div>
          ) : step === "done" ? (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              <CheckCircle className="h-4 w-4" />
              Campaign created successfully! Redirecting...
            </div>
          ) : (
            <button
              onClick={handleDemo}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {getStepLabel()}
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/[0.06]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#08080f] px-3 text-gray-500">or create custom</span>
          </div>
        </div>

        {/* Existing Form */}
        {!isConnected ? (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-12 text-center backdrop-blur-sm">
            <Rocket className="mx-auto mb-4 h-12 w-12 text-gray-600" />
            <p className="mb-4 text-gray-400">
              {t('connectToCreate')}
            </p>
            <ConnectButton />
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm">
            <CreateCampaignForm sponsorAddress={address} />
          </div>
        )}
      </div>
    </div>
  );
}
