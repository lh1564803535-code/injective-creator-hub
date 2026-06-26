"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

// ---------------------------------------------------------------------------
// Pagination – reusable pagination with page-size selector
// ---------------------------------------------------------------------------

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  totalItems?: number;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  pages.push(total);
  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  pageSizeOptions = [10, 20, 50],
  onPageSizeChange,
  totalItems,
}: PaginationProps) {
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      {/* Page info + page-size selector */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        {totalItems !== undefined && (
          <span>
            Showing{" "}
            <span className="font-medium text-gray-300">
              {(currentPage - 1) * (pageSize ?? totalItems) + 1}
            </span>
            {" "}-{" "}
            <span className="font-medium text-gray-300">
              {Math.min(currentPage * (pageSize ?? totalItems), totalItems)}
            </span>
            {" "}of{" "}
            <span className="font-medium text-gray-300">{totalItems}</span>
          </span>
        )}

        {onPageSizeChange && (
          <label className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-lg border border-white/[0.06] bg-white/[0.04] px-2 py-1 text-sm text-gray-300 outline-none focus:border-cyan-500"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {/* Page buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] text-gray-500 transition hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-8 w-8 items-center justify-center text-sm text-gray-600"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition ${
                page === currentPage
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                  : "border border-white/[0.06] text-gray-500 hover:bg-white/[0.04]"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] text-gray-500 transition hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
