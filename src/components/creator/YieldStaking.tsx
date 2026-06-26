"use client";

import { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  Lock,
  Unlock,
  Loader2,
  Coins,
  ArrowUpRight,
  Info,
} from "lucide-react";
import { formatUSDC } from "@/lib/injective";
import { useToast } from "@/components/ui/Toast";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StakingPool {
  id: string;
  name: string;
  apy: number;
  lockPeriod: string;
  lockDays: number;
  tvl: bigint;
  minStake: bigint;
  color: string;
  gradient: string;
}

interface UserStake {
  poolId: string;
  amount: bigint;
  startTime: number;
  lockEnd: number;
  earned: bigint;
}

// ---------------------------------------------------------------------------
// Mock Staking Pools
// ---------------------------------------------------------------------------

const STAKING_POOLS: StakingPool[] = [
  {
    id: "flexible",
    name: "Flexible Yield",
    apy: 4.2,
    lockPeriod: "No lock",
    lockDays: 0,
    tvl: BigInt(2_500_000_000_000), // 2.5M USDC
    minStake: BigInt(10_000_000), // 10 USDC
    color: "text-emerald-400",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    id: "30day",
    name: "30-Day Creator Boost",
    apy: 8.5,
    lockPeriod: "30 days",
    lockDays: 30,
    tvl: BigInt(8_000_000_000_000), // 8M USDC
    minStake: BigInt(50_000_000), // 50 USDC
    color: "text-cyan-400",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "90day",
    name: "90-Day Diamond Creator",
    apy: 15.0,
    lockPeriod: "90 days",
    lockDays: 90,
    tvl: BigInt(15_000_000_000_000), // 15M USDC
    minStake: BigInt(100_000_000), // 100 USDC
    color: "text-amber-400",
    gradient: "from-amber-500 to-orange-600",
  },
];

// ---------------------------------------------------------------------------
// Animated APY counter
// ---------------------------------------------------------------------------

function AnimatedAPY({ value, color }: { value: number; color: string }) {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          function update(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / 1500, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayed(parseFloat((value * eased).toFixed(1)));
            if (progress < 1) requestAnimationFrame(update);
            else setDisplayed(value);
          }
          requestAnimationFrame(update);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className={color}>
      {displayed.toFixed(1)}%
    </span>
  );
}

// ---------------------------------------------------------------------------
// Yield ticker (simulated real-time yield accumulation)
// ---------------------------------------------------------------------------

function YieldTicker({ staked, apy }: { staked: bigint; apy: number }) {
  const [earned, setEarned] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const baseUsdc = Number(staked) / 1e6;
    const perSecond = (baseUsdc * (apy / 100)) / (365 * 24 * 3600);

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      setEarned(perSecond * elapsed);
    }, 100);

    return () => clearInterval(interval);
  }, [staked, apy]);

  return (
    <span className="font-mono text-emerald-400 tabular-nums">
      +{earned.toFixed(6)} USDC
    </span>
  );
}

// ---------------------------------------------------------------------------
// TVL formatter
// ---------------------------------------------------------------------------

function formatTVL(value: bigint): string {
  const usdc = Number(value) / 1e6;
  if (usdc >= 1_000_000) return `$${(usdc / 1_000_000).toFixed(1)}M`;
  if (usdc >= 1_000) return `$${(usdc / 1_000).toFixed(0)}K`;
  return `$${usdc.toFixed(0)}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface YieldStakingProps {
  availableBalance?: bigint;
}

export function YieldStaking({ availableBalance = BigInt(750_000_000) }: YieldStakingProps) {
  const { toast } = useToast();
  const [stakes, setStakes] = useState<UserStake[]>([]);
  const [stakingPoolId, setStakingPoolId] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);

  const totalStaked = stakes.reduce((sum, s) => sum + s.amount, BigInt(0));
  const totalEarnedSimulated = stakes.reduce((sum, s) => sum + s.earned, BigInt(0));

  const handleStakeClick = (pool: StakingPool) => {
    setSelectedPool(pool);
    setStakeAmount("");
    setShowStakeModal(true);
  };

  const handleConfirmStake = () => {
    if (!selectedPool || !stakeAmount) return;

    const amountNum = parseFloat(stakeAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const amountBigInt = BigInt(Math.floor(amountNum * 1e6));
    const minStake = selectedPool.minStake;

    if (amountBigInt < minStake) {
      toast({
        variant: "error",
        title: "Below minimum",
        description: `Minimum stake is ${formatUSDC(minStake)} USDC`,
      });
      return;
    }

    if (amountBigInt > availableBalance) {
      toast({
        variant: "error",
        title: "Insufficient balance",
        description: "Not enough USDC available",
      });
      return;
    }

    setStakingPoolId(selectedPool.id);
    setShowStakeModal(false);

    toast({
      variant: "pending",
      title: "Staking...",
      description: `${stakeAmount} USDC into ${selectedPool.name}`,
      duration: 0,
    });

    setTimeout(() => {
      const now = Math.floor(Date.now() / 1000);
      const newStake: UserStake = {
        poolId: selectedPool.id,
        amount: amountBigInt,
        startTime: now,
        lockEnd: now + selectedPool.lockDays * 86400,
        earned: BigInt(0),
      };
      setStakes((prev) => [...prev, newStake]);
      setStakingPoolId(null);

      toast({
        variant: "success",
        title: "Staked successfully!",
        description: `${stakeAmount} USDC earning ${selectedPool.apy}% APY`,
      });
    }, 2000);
  };

  const handleUnstake = (index: number) => {
    const stake = stakes[index];
    const pool = STAKING_POOLS.find((p) => p.id === stake.poolId);
    if (!pool) return;

    if (pool.lockDays > 0) {
      const now = Math.floor(Date.now() / 1000);
      if (now < stake.lockEnd) {
        const daysLeft = Math.ceil((stake.lockEnd - now) / 86400);
        toast({
          variant: "error",
          title: "Still locked",
          description: `${daysLeft} days remaining. Early unstake incurs a 10% penalty.`,
        });
        return;
      }
    }

    toast({
      variant: "pending",
      title: "Unstaking...",
      description: `${formatUSDC(stake.amount)} USDC`,
      duration: 0,
    });

    setTimeout(() => {
      setStakes((prev) => prev.filter((_, i) => i !== index));
      toast({
        variant: "success",
        title: "Unstaked!",
        description: `${formatUSDC(stake.amount)} USDC returned to wallet`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Coins className="h-5 w-5 text-amber-400" />
            Yield Staking
          </h2>
          <p className="text-sm text-gray-500">
            Stake USDC earnings to earn passive yield
          </p>
        </div>
        {totalStaked > BigInt(0) && (
          <div className="text-right">
            <p className="text-xs text-gray-500">Total Staked</p>
            <p className="text-lg font-bold text-white">
              {formatUSDC(totalStaked)} USDC
            </p>
            <YieldTicker
              staked={totalStaked}
              apy={
                stakes.length > 0
                  ? STAKING_POOLS.find((p) => p.id === stakes[0].poolId)?.apy ?? 0
                  : 0
              }
            />
          </div>
        )}
      </div>

      {/* Active stakes */}
      {stakes.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Your Active Stakes
          </p>
          {stakes.map((stake, i) => {
            const pool = STAKING_POOLS.find((p) => p.id === stake.poolId);
            if (!pool) return null;
            const now = Math.floor(Date.now() / 1000);
            const isLocked = pool.lockDays > 0 && now < stake.lockEnd;
            const daysLeft = isLocked
              ? Math.ceil((stake.lockEnd - now) / 86400)
              : 0;

            return (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${pool.gradient} opacity-20`}
                  >
                    {isLocked ? (
                      <Lock className="h-4 w-4 text-white" />
                    ) : (
                      <Unlock className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {pool.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatUSDC(stake.amount)} USDC &middot; {pool.apy}% APY
                      {isLocked && ` &middot; ${daysLeft}d left`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <YieldTicker staked={stake.amount} apy={pool.apy} />
                  </div>
                  <button
                    onClick={() => handleUnstake(i)}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-gray-400 transition hover:border-white/[0.15] hover:text-white"
                  >
                    Unstake
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Staking Pools */}
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
          Available Pools
        </p>
        {STAKING_POOLS.map((pool) => (
          <div
            key={pool.id}
            className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-white/[0.12] hover:bg-white/[0.03]"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full bg-gradient-to-r ${pool.gradient}`}
                  />
                  <h3 className="text-sm font-semibold text-white">
                    {pool.name}
                  </h3>
                  {pool.lockDays === 0 && (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                      Flexible
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <span>
                    Lock: <span className="text-gray-300">{pool.lockPeriod}</span>
                  </span>
                  <span>
                    Min:{" "}
                    <span className="text-gray-300">
                      {formatUSDC(pool.minStake)} USDC
                    </span>
                  </span>
                  <span>
                    TVL: <span className="text-gray-300">{formatTVL(pool.tvl)}</span>
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">APY</p>
                <p className="text-2xl font-bold">
                  <AnimatedAPY value={pool.apy} color={pool.color} />
                </p>
              </div>
            </div>

            {/* Yield projection bar */}
            <div className="mt-4 rounded-lg bg-white/[0.02] p-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  Projected yield on 100 USDC / 30 days
                </span>
                <span className={pool.color}>
                  +{((100 * pool.apy) / 100 / 12).toFixed(2)} USDC
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${pool.gradient} transition-all duration-1000`}
                  style={{ width: `${Math.min(pool.apy * 5, 100)}%` }}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Info className="h-3 w-3" />
                <span>
                  {pool.lockDays === 0
                    ? "Withdraw anytime, no penalty"
                    : `Early withdrawal: 10% penalty`}
                </span>
              </div>
              <button
                onClick={() => handleStakeClick(pool)}
                disabled={stakingPoolId !== null}
                className={`inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r ${pool.gradient} px-4 py-2 text-xs font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50`}
              >
                <TrendingUp className="h-3 w-3" />
                Stake
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Staking Modal */}
      {showStakeModal && selectedPool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#1a1a1a] p-6 shadow-2xl">
            <h3 className="mb-1 text-lg font-semibold text-white">
              Stake in {selectedPool.name}
            </h3>
            <p className="mb-4 text-sm text-gray-500">
              {selectedPool.apy}% APY &middot; {selectedPool.lockPeriod}
            </p>

            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-gray-500">Amount (USDC)</span>
                <button
                  onClick={() =>
                    setStakeAmount(
                      (Number(availableBalance) / 1e6).toFixed(2)
                    )
                  }
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  Max: {(Number(availableBalance) / 1e6).toFixed(2)}
                </button>
              </div>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder={`Min ${formatUSDC(selectedPool.minStake)}`}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-white placeholder-gray-600 outline-none transition focus:border-cyan-500/40"
                min={Number(selectedPool.minStake) / 1e6}
                step="0.01"
              />
            </div>

            {stakeAmount && parseFloat(stakeAmount) > 0 && (
              <div className="mb-4 rounded-lg bg-white/[0.03] p-3 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Est. yield (30 days)</span>
                  <span className="text-emerald-400">
                    +
                    {(
                      (parseFloat(stakeAmount) * selectedPool.apy) /
                      100 /
                      12
                    ).toFixed(2)}{" "}
                    USDC
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowStakeModal(false)}
                className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 text-sm text-gray-400 transition hover:bg-white/[0.06]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStake}
                disabled={
                  !stakeAmount ||
                  parseFloat(stakeAmount) <= 0 ||
                  stakingPoolId !== null
                }
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
              >
                {stakingPoolId === selectedPool.id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Staking...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Confirm Stake
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info banner */}
      <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
        <div className="flex items-start gap-3">
          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-gray-600" />
          <div className="text-xs leading-relaxed text-gray-600">
            <p>
              Yield is generated through Injective&apos;s DeFi protocols. Staked USDC
              is deployed to lending markets and liquidity pools. APY rates are
              variable and depend on market conditions. Smart contract risk
              applies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
