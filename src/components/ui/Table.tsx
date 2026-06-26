"use client";

import { useState, useMemo, useCallback } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (item: T, index: number) => React.ReactNode;
}

export type SortDirection = "asc" | "desc";

export interface SortState {
  key: string;
  direction: SortDirection;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  /** Enable row selection checkboxes */
  selectable?: boolean;
  /** Controlled selected row keys */
  selectedKeys?: Set<string | number>;
  /** Callback when selection changes */
  onSelectionChange?: (keys: Set<string | number>) => void;
  /** Function to extract a unique key from each row */
  rowKey?: (item: T) => string | number;
  /** Enable pagination */
  pageSize?: number;
  /** Controlled sort state */
  sort?: SortState;
  /** Callback when sort changes */
  onSortChange?: (sort: SortState) => void;
  /** Row click handler */
  onRowClick?: (item: T) => void;
  /** Empty state message */
  emptyMessage?: string;
  /** Zebra stripe rows */
  zebra?: boolean;
  /** Additional class names */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Table<T>({
  columns,
  data,
  selectable = false,
  selectedKeys: controlledKeys,
  onSelectionChange,
  rowKey,
  pageSize = 10,
  sort: controlledSort,
  onSortChange,
  onRowClick,
  emptyMessage = "No data",
  zebra = true,
  className = "",
}: TableProps<T>) {
  // Internal state for uncontrolled mode
  const [internalSort, setInternalSort] = useState<SortState | null>(null);
  const [internalKeys, setInternalKeys] = useState<Set<string | number>>(
    new Set()
  );
  const [page, setPage] = useState(1);

  const activeSort = controlledSort ?? internalSort;
  const selectedKeys = controlledKeys ?? internalKeys;

  // Key extractor
  const getKey = useCallback(
    (item: T, index: number): string | number => {
      if (rowKey) return rowKey(item);
      return (item as Record<string, unknown>)["id"] as string | number ?? index;
    },
    [rowKey]
  );

  // Sort
  const sortedData = useMemo(() => {
    if (!activeSort) return data;
    const col = columns.find((c) => c.key === activeSort.key);
    if (!col) return data;

    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[activeSort.key];
      const bVal = (b as Record<string, unknown>)[activeSort.key];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let cmp = 0;
      if (typeof aVal === "number" && typeof bVal === "number") {
        cmp = aVal - bVal;
      } else if (typeof aVal === "bigint" && typeof bVal === "bigint") {
        cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else if (typeof aVal === "string" && typeof bVal === "string") {
        cmp = aVal.localeCompare(bVal);
      } else {
        cmp = String(aVal).localeCompare(String(bVal));
      }

      return activeSort.direction === "desc" ? -cmp : cmp;
    });
  }, [data, activeSort, columns]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Reset page when data changes
  useMemo(() => {
    if (currentPage > totalPages) setPage(totalPages);
  }, [totalPages, currentPage]);

  // Sort handler
  const handleSort = (key: string) => {
    const next: SortState = (() => {
      if (activeSort?.key === key) {
        return activeSort.direction === "asc"
          ? { key, direction: "desc" }
          : { key, direction: "asc" };
      }
      return { key, direction: "asc" };
    })();
    if (onSortChange) {
      onSortChange(next);
    } else {
      setInternalSort(next);
    }
    setPage(1);
  };

  // Selection handler
  const toggleRow = (key: string | number) => {
    const next = new Set(selectedKeys);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    if (onSelectionChange) {
      onSelectionChange(next);
    } else {
      setInternalKeys(next);
    }
  };

  const toggleAll = () => {
    const currentPageKeys = paginatedData.map((item, i) => getKey(item, i));
    const allSelected = currentPageKeys.every((k) => selectedKeys.has(k));
    const next = new Set(selectedKeys);
    if (allSelected) {
      currentPageKeys.forEach((k) => next.delete(k));
    } else {
      currentPageKeys.forEach((k) => next.add(k));
    }
    if (onSelectionChange) {
      onSelectionChange(next);
    } else {
      setInternalKeys(next);
    }
  };

  const currentPageKeys = paginatedData.map((item, i) => getKey(item, i));
  const allPageSelected =
    currentPageKeys.length > 0 &&
    currentPageKeys.every((k) => selectedKeys.has(k));
  const somePageSelected =
    currentPageKeys.some((k) => selectedKeys.has(k)) && !allPageSelected;

  // Render sort icon
  const SortIcon = ({ colKey }: { colKey: string }) => {
    if (activeSort?.key === colKey) {
      return activeSort.direction === "asc" ? (
        <ChevronUp className="h-3.5 w-3.5 text-cyan-400" />
      ) : (
        <ChevronDown className="h-3.5 w-3.5 text-cyan-400" />
      );
    }
    return <ChevronsUpDown className="h-3.5 w-3.5 text-gray-600" />;
  };

  return (
    <div className={`overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              {selectable && (
                <th className="w-10 px-3 py-3">
                  <button
                    onClick={toggleAll}
                    className={`flex h-4.5 w-4.5 items-center justify-center rounded border transition ${
                      allPageSelected
                        ? "border-cyan-500 bg-cyan-500"
                        : somePageSelected
                          ? "border-cyan-500 bg-cyan-500/40"
                          : "border-white/[0.12] hover:border-white/[0.2]"
                    }`}
                  >
                    {(allPageSelected || somePageSelected) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </button>
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={`px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 ${
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                        ? "text-right"
                        : "text-left"
                  } ${col.sortable ? "cursor-pointer select-none hover:text-gray-300" : ""}`}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.header}
                    {col.sortable && <SortIcon colKey={col.key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-12 text-center text-sm text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => {
                const key = getKey(item, (currentPage - 1) * pageSize + index);
                const isSelected = selectedKeys.has(key);
                const globalIndex = (currentPage - 1) * pageSize + index;

                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick?.(item)}
                    className={`border-b border-white/[0.04] transition ${
                      zebra && globalIndex % 2 === 1
                        ? "bg-white/[0.01]"
                        : ""
                    } ${
                      isSelected ? "bg-cyan-500/[0.06]" : ""
                    } ${onRowClick ? "cursor-pointer hover:bg-white/[0.04]" : ""}`}
                  >
                    {selectable && (
                      <td className="px-3 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRow(key);
                          }}
                          className={`flex h-4.5 w-4.5 items-center justify-center rounded border transition ${
                            isSelected
                              ? "border-cyan-500 bg-cyan-500"
                              : "border-white/[0.12] hover:border-white/[0.2]"
                          }`}
                        >
                          {isSelected && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </button>
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 text-sm text-gray-300 ${
                          col.align === "center"
                            ? "text-center"
                            : col.align === "right"
                              ? "text-right"
                              : ""
                        }`}
                      >
                        {col.render
                          ? col.render(item, globalIndex)
                          : ((item as Record<string, unknown>)[col.key] as React.ReactNode ?? "—")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <p className="text-xs text-gray-500">
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
            {sortedData.length}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] text-gray-500 transition hover:bg-white/[0.04] disabled:opacity-30"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-medium transition ${
                  p === currentPage
                    ? "bg-cyan-500 text-white"
                    : "border border-white/[0.06] text-gray-500 hover:bg-white/[0.04]"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] text-gray-500 transition hover:bg-white/[0.04] disabled:opacity-30"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
