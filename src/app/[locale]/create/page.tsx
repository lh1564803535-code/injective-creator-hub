"use client";

import { useState, useEffect, useRef } from "react";
import {useTranslations} from 'next-intl';
import {Link, useRouter} from '@/i18n/navigation';
import { ArrowLeft, Rocket, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useChainId, useSwitchChain, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { CreateCampaignForm } from "@/components/campaign/CreateCampaignForm";
import { BOUNTY_CAMPAIGN_ADDRESS, BOUNTY_CAMPAIGN_ABI } from "@/lib/contract-abi";
import { INJECTIVE_CHAIN_ID } from "@/lib/wagmi";

// Testnet USDC address
const USDC_ADDRESS = "0xF22bede237A07E121B56d91A491EB7bCDfD1F590" as const;

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

  // Ref to prevent double-trigger
  const createTriggered = useRef(false);

  // When approve tx confirms → call createCampaign (once)
  useEffect(() => {
    if (isApproveSuccess && step === "confirming-approve" && !createTriggered.current) {
      createTriggered.current = true;
      setStep("creating");
      writeCreate({
        address: BOUNTY_CAMPAIGN_ADDRESS,
        abi: BOUNTY_CAMPAIGN_ABI,
        functionName: "createCampaign",
        args: [
          "Welcome to Creator Hub",
          "Your first campaign — submit content and earn USDC",
          parseUnits("10", 6),
          BigInt(604800),
        ],
      });
    }
  }, [isApproveSuccess, step]);

  // When create tx is submitted → move to confirming
  useEffect(() => {
    if (step === "creating" && isCreateConfirming) {
      setStep("confirming-create");
    }
  }, [step, isCreateConfirming]);

  // When create tx confirms → redirect (once)
  const redirectTriggered = useRef(false);
  useEffect(() => {
    if (isCreateSuccess && !redirectTriggered.current) {
      redirectTriggered.current = true;
      setStep("done");
      setTimeout(() => router.push("/"), 2000);
    }
  }, [isCreateSuccess]);

  const handleDemo = async () => {
    setErrorMsg("");

    // Step 0: Check wallet connection
    if (!isConnected) {
      // RainbowKit will handle this via ConnectButton
      return;
    }

    // Step 1: Switch to Injective Testnet if needed
    if (chainId !== INJECTIVE_CHAIN_ID) {
      try {
        await switchChain({ chainId: INJECTIVE_CHAIN_ID });
      } catch {
        setErrorMsg("请在钱包中切换到 Injective 测试网（Chain ID 1439）");
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
      setErrorMsg(e?.message || "USDC 授权失败，请重试");
      setStep("error");
    }
  };

  const getStepLabel = () => {
    switch (step) {
      case "approving": return "授权 USDC 中...";
      case "confirming-approve": return "确认授权中...";
      case "creating": return "创建活动中...";
      case "confirming-create": return "确认创建中...";
      case "done": return "完成！跳转中...";
      case "error": return "出错了";
      default: return "🎯 一键创建 Demo 活动";
    }
  };

  const isLoading = ["approving", "confirming-approve", "creating", "confirming-create"].includes(step);

  return (
    <div className="page-enter">
        <div className="mb-8">
          <h1 className="mb-2 text-xl font-bold text-[#EAECEF]">
            {t('createCampaign')}
          </h1>
          <p className="text-sm text-[#848E9C]">
            {t('launchBounty')}
          </p>
        </div>

        {/* Demo Campaign Button */}
        <div className="mb-6 rounded-xl border border-[#00D4AA]/20 bg-[#00D4AA]/5 p-6">
          <h2 className="mb-2 text-lg font-semibold text-[#EAECEF]">快速体验</h2>
          <p className="mb-4 text-sm text-[#848E9C]">
            一键创建测试网赏金活动，需要 10 USDC 测试币
          </p>

          {!isConnected ? (
            <ConnectButton />
          ) : step === "error" ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-[#F6465D]/10 px-4 py-2 text-sm text-[#F6465D]">
                <AlertCircle className="h-4 w-4" />
                {errorMsg}
              </div>
              <button
                onClick={() => { setStep("idle"); setErrorMsg(""); }}
                className="rounded-lg bg-[#2B3139] px-4 py-2 text-sm text-[#EAECEF] hover:bg-[#2B3139]/80"
              >
                重试
              </button>
            </div>
          ) : step === "done" ? (
            <div className="flex items-center gap-2 rounded-lg bg-[#00D4AA]/10 px-4 py-3 text-sm text-[#00D4AA]">
              <CheckCircle className="h-4 w-4" />
              活动创建成功！跳转中...
            </div>
          ) : (
            <button
              onClick={handleDemo}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#00D4AA] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#00D4AA]/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {getStepLabel()}
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#2B3139]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#0B0E11] px-3 text-[#848E9C]">或自定义创建</span>
          </div>
        </div>

        {/* Existing Form */}
        {!isConnected ? (
          <div className="rounded-xl border border-[#2B3139] bg-[#1E2329] p-12 text-center">
            <Rocket className="mx-auto mb-4 h-12 w-12 text-[#848E9C]" />
            <p className="mb-4 text-[#848E9C]">
              {t('connectToCreate')}
            </p>
            <ConnectButton />
          </div>
        ) : (
          <div className="rounded-xl border border-[#2B3139] bg-[#1E2329] p-6">
            <CreateCampaignForm sponsorAddress={address} />
          </div>
        )}
    </div>
  );
}
