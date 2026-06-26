"use client";

import { useState, useCallback, useRef } from "react";
import { GripVertical, Plus } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  /** Optional badge text shown on the card */
  badge?: string;
  /** Badge color classes (Tailwind) */
  badgeClassName?: string;
  /** Optional metadata rendered below the description */
  meta?: React.ReactNode;
  /** Arbitrary payload for consumers */
  data?: Record<string, unknown>;
}

export interface KanbanColumn {
  id: string;
  title: string;
  /** Accent color for the column header dot */
  dotClassName?: string;
  cards: KanbanCard[];
}

interface KanbanProps {
  columns: KanbanColumn[];
  /** Called when a card is moved between columns */
  onCardMove?: (
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
    newIndex: number,
  ) => void;
  /** Optional header action rendered in the top-right */
  headerAction?: React.ReactNode;
  className?: string;
}

// ---------------------------------------------------------------------------
// Drag state (module-level so event handlers share it without re-renders)
// ---------------------------------------------------------------------------

let dragCardId: string | null = null;
let dragFromColumnId: string | null = null;

// ---------------------------------------------------------------------------
// Card component
// ---------------------------------------------------------------------------

function CardView({
  card,
  columnId,
}: {
  card: KanbanCard;
  columnId: string;
}) {
  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      dragCardId = card.id;
      dragFromColumnId = columnId;
      e.dataTransfer.effectAllowed = "move";
      // Required for Firefox
      e.dataTransfer.setData("text/plain", card.id);
    },
    [card.id, columnId],
  );

  const handleDragEnd = useCallback(() => {
    dragCardId = null;
    dragFromColumnId = null;
  }, []);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="group/card cursor-grab rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5 transition-all hover:border-white/[0.12] hover:bg-white/[0.05] active:cursor-grabbing"
    >
      <div className="flex items-start gap-2">
        <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-gray-600 opacity-0 transition-opacity group-hover/card:opacity-100" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium text-gray-200">
              {card.title}
            </span>
            {card.badge && (
              <span
                className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${card.badgeClassName ?? "bg-white/[0.06] text-gray-400"}`}
              >
                {card.badge}
              </span>
            )}
          </div>
          {card.description && (
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">
              {card.description}
            </p>
          )}
          {card.meta && <div className="mt-2">{card.meta}</div>}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Column component
// ---------------------------------------------------------------------------

function ColumnView({
  column,
  onDrop,
}: {
  column: KanbanColumn;
  onDrop: (cardId: string, fromColumnId: string, toColumnId: string) => void;
}) {
  const [isOver, setIsOver] = useState(false);
  const counterRef = useRef(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      counterRef.current += 1;
      if (counterRef.current === 1) setIsOver(true);
    },
    [],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      counterRef.current -= 1;
      if (counterRef.current === 0) setIsOver(false);
    },
    [],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      counterRef.current = 0;
      setIsOver(false);
      const cardId = e.dataTransfer.getData("text/plain") || dragCardId;
      const fromId = dragFromColumnId;
      if (cardId && fromId && fromId !== column.id) {
        onDrop(cardId, fromId, column.id);
      }
    },
    [column.id, onDrop],
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex min-w-[280px] flex-1 flex-col rounded-2xl border transition-colors ${
        isOver
          ? "border-cyan-500/40 bg-cyan-500/[0.04]"
          : "border-white/[0.06] bg-white/[0.02]"
      }`}
    >
      {/* Column header */}
      <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-4 py-3">
        {column.dotClassName && (
          <span className={`h-2 w-2 rounded-full ${column.dotClassName}`} />
        )}
        <span className="text-sm font-semibold text-white">
          {column.title}
        </span>
        <span className="ml-auto rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-gray-500">
          {column.cards.length}
        </span>
      </div>

      {/* Card list */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
        {column.cards.map((card) => (
          <CardView key={card.id} card={card} columnId={column.id} />
        ))}

        {column.cards.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-white/[0.06] py-8 text-xs text-gray-600">
            Drop cards here
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Kanban component
// ---------------------------------------------------------------------------

export function Kanban({
  columns: initialColumns,
  onCardMove,
  headerAction,
  className = "",
}: KanbanProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);

  // Sync when props change
  const prevRef = useRef(initialColumns);
  if (initialColumns !== prevRef.current) {
    prevRef.current = initialColumns;
    setColumns(initialColumns);
  }

  const handleDrop = useCallback(
    (cardId: string, fromColumnId: string, toColumnId: string) => {
      setColumns((prev) => {
        const next = prev.map((col) => ({ ...col, cards: [...col.cards] }));
        const fromCol = next.find((c) => c.id === fromColumnId);
        const toCol = next.find((c) => c.id === toColumnId);
        if (!fromCol || !toCol) return prev;

        const cardIndex = fromCol.cards.findIndex((c) => c.id === cardId);
        if (cardIndex === -1) return prev;

        const [card] = fromCol.cards.splice(cardIndex, 1);
        toCol.cards.push(card);

        return next;
      });

      onCardMove?.(cardId, fromColumnId, toColumnId, 0);
    },
    [onCardMove],
  );

  return (
    <div className={className}>
      {/* Header */}
      {(headerAction) && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Board</h3>
          {headerAction}
        </div>
      )}

      {/* Columns */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {columns.map((col) => (
          <ColumnView key={col.id} column={col} onDrop={handleDrop} />
        ))}
      </div>
    </div>
  );
}
