"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PriceTickerProps {
  symbol: string;
  price: number;
  change24h: number;
  className?: string;
}

export function PriceTicker({
  symbol,
  price,
  change24h,
  className = "",
}: PriceTickerProps) {
  const [displayPrice, setDisplayPrice] = useState(price);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.5) * price * 0.001;
      const newPrice = price + delta;
      setDisplayPrice(newPrice);
      setFlash(delta > 0 ? "up" : "down");
      setTimeout(() => setFlash(null), 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [price]);

  const isPositive = change24h >= 0;

  return (
    <div className={`flex items-center gap-3 rounded-lg bg-white/[0.02] px-3 py-2 ${className}`}>
      <div>
        <p className="text-xs font-medium text-white">{symbol}</p>
        <p className={`text-sm font-bold transition-colors ${
          flash === "up" ? "text-emerald-400" : flash === "down" ? "text-red-400" : "text-white"
        }`}>
          ${displayPrice.toFixed(2)}
        </p>
      </div>
      <div className={`flex items-center gap-0.5 ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        <span className="text-xs">{isPositive ? "+" : ""}{change24h.toFixed(2)}%</span>
      </div>
    </div>
  );
}
