"use client";

interface MiniChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showDots?: boolean;
  className?: string;
}

export function MiniChart({
  data,
  width = 120,
  height = 40,
  color = "#22c55e",
  showDots = false,
  className = "",
}: MiniChartProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);

  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  const linePath = `M${points.join(" L")}`;
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;

  const isPositive = data[data.length - 1] >= data[0];

  return (
    <div className={className}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id={`mini-chart-grad-${isPositive ? "up" : "down"}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isPositive ? "#22c55e" : "#ef4444"} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#mini-chart-grad-${isPositive ? "up" : "down"})`} />
        <path d={linePath} fill="none" stroke={isPositive ? "#22c55e" : "#ef4444"} strokeWidth="1.5" strokeLinecap="round" />
        {showDots && points.map((p, i) => (
          <circle key={i} cx={parseFloat(p.split(",")[0])} cy={parseFloat(p.split(",")[1])} r="2" fill={isPositive ? "#22c55e" : "#ef4444"} />
        ))}
      </svg>
    </div>
  );
}
