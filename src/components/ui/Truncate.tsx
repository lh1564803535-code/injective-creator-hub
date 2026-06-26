"use client";

import { useState } from "react";

interface TruncateProps {
  text: string;
  maxLength?: number;
  className?: string;
}

export function Truncate({
  text,
  maxLength = 100,
  className = "",
}: TruncateProps) {
  const [expanded, setExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {expanded ? text : `${text.slice(0, maxLength)}...`}
      <button
        onClick={() => setExpanded(!expanded)}
        className="ml-1 text-cyan-400 hover:text-cyan-300"
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    </span>
  );
}
