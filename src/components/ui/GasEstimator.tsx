"use client";

import { useState, useEffect } from "react";
import { Fuel, Zap, TrendingDown } from "lucide-react";

interface GasEstimatorProps {
  /** Transaction type for estimation */
  type?: "vote" | "submit" | "claim" | "transfer" | "deploy";
}

const GAS_ESTIMATES = {
  vote: { gas: "0.001", usd: "0.02", speed: "instant" },
  submit: { gas: "0.002", usd: "0.04", speed: "instant" },
  claim: { gas: "0.001", usd: "0.02", speed: "instant" },
  transfer: { gas: "0.001", usd: "0.02", speed: "instant" },
  deploy: { gas: "0.05", usd: "1.00", speed: "~5s" },
};

export function GasEstimator({ type = "transfer" }: GasEstimatorProps) {
  const [estimate, setEstimate] = useState(GAS_ESTIMATES[type]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setEstimate(GAS_ESTIMATES[type]);
  }, [type]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    const element = document.getElementById("gas-estimator");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      id="gas-estimator"
      className={`rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 transition-all ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15">
          <Fuel className="h-4 w-4 text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">Gas Estimate</p>
          <p className="text-xs text-gray-500">Injective EVM</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Cost</p>
          <p className="font-mono text-lg font-bold text-emerald-400">
            {estimate.gas} INJ
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">USD</p>
          <p className="font-mono text-lg font-bold text-white">
            ${estimate.usd}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Speed</p>
          <div className="flex items-center justify-center gap-1">
            <Zap className="h-3 w-3 text-amber-400" />
            <p className="text-sm font-medium text-amber-400">{estimate.speed}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1 rounded-lg bg-emerald-500/10 px-3 py-2">
        <TrendingDown className="h-3 w-3 text-emerald-400" />
        <p className="text-[10px] text-emerald-400">
          Gas fees on Injective are 99% cheaper than Ethereum
        </p>
      </div>
    </div>
  );
}
