"use client";

import { useState } from "react";
import { Grid, List } from "lucide-react";

interface CollectionGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function CollectionGrid({
  children,
  columns = 3,
  className = "",
}: CollectionGridProps) {
  const [view, setView] = useState<"grid" | "list">("grid");

  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div className={className}>
      {/* View toggle */}
      <div className="mb-4 flex items-center justify-end gap-2">
        <button
          onClick={() => setView("grid")}
          className={`rounded-lg p-1.5 ${view === "grid" ? "bg-white/[0.06] text-white" : "text-gray-500"}`}
        >
          <Grid className="h-4 w-4" />
        </button>
        <button
          onClick={() => setView("list")}
          className={`rounded-lg p-1.5 ${view === "list" ? "bg-white/[0.06] text-white" : "text-gray-500"}`}
        >
          <List className="h-4 w-4" />
        </button>
      </div>

      {/* Grid */}
      <div className={`grid gap-4 ${gridCols[columns]}`}>
        {children}
      </div>
    </div>
  );
}
