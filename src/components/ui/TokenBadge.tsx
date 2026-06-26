"use client";

interface TokenBadgeProps {
  symbol: string;
  icon?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-5 w-5 text-[8px]",
  md: "h-7 w-7 text-[10px]",
  lg: "h-9 w-9 text-xs",
};

export function TokenBadge({
  symbol,
  icon,
  size = "md",
  className = "",
}: TokenBadgeProps) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 font-bold text-white ${sizeClasses[size]} ${className}`}
      title={symbol}
    >
      {icon ? (
        <img src={icon} alt={symbol} className="h-full w-full rounded-full object-cover" />
      ) : (
        symbol.slice(0, 2).toUpperCase()
      )}
    </div>
  );
}
