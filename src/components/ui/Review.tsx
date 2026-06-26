"use client";

import { useState, useCallback } from "react";
import { Star, ThumbsUp, Send, User, MessageSquare } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ReviewItem {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  rating: number;
  likes: number;
  liked?: boolean;
  createdAt: number;
}

interface ReviewProps {
  reviews?: ReviewItem[];
  onSubmit?: (content: string, rating: number) => void;
  onLike?: (reviewId: string) => void;
  className?: string;
  title?: string;
  emptyMessage?: string;
  maxHeight?: string;
  allowSubmit?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function Stars({ rating, size = 4 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-${size} w-${size} ${
            i < rating ? "fill-amber-400 text-amber-400" : "text-gray-700"
          }`}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ReviewCard({
  review,
  onLike,
}: {
  review: ReviewItem;
  onLike?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-5 transition hover:border-white/[0.1]">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-gray-400">
          {review.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={review.avatar} alt={review.author} className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <User className="h-4 w-4" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{review.author}</span>
            <span className="text-[11px] text-gray-600">{formatRelativeTime(review.createdAt)}</span>
          </div>
          <Stars rating={review.rating} size={3.5} />
        </div>
      </div>

      {/* Content */}
      <p className="mt-3 text-sm leading-relaxed text-gray-300 whitespace-pre-line">{review.content}</p>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-4 border-t border-white/[0.04] pt-3">
        <button
          onClick={onLike}
          className={`inline-flex items-center gap-1.5 text-xs transition ${
            review.liked ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          <span>{review.likes}</span>
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function Review({
  reviews = [],
  onSubmit,
  onLike,
  className = "",
  title = "Reviews",
  emptyMessage = "No reviews yet. Be the first to leave a review!",
  maxHeight = "max-h-[600px]",
  allowSubmit = true,
}: ReviewProps) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = useCallback(() => {
    const trimmed = content.trim();
    if (!trimmed || rating === 0 || !onSubmit) return;
    onSubmit(trimmed, rating);
    setContent("");
    setRating(0);
    setShowForm(false);
  }, [content, onSubmit, rating]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111] ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-3">
          <Star className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-semibold text-white">{title}</span>
          <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-gray-500">
            {reviews.length}
          </span>
          {reviews.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Stars rating={Math.round(avgRating)} size={3} />
              <span className="text-xs text-gray-500">{avgRating.toFixed(1)}</span>
            </div>
          )}
        </div>
        {allowSubmit && onSubmit && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-cyan-500"
          >
            {showForm ? "Cancel" : "Write Review"}
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="border-b border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
          {/* Star Rating Input */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Your rating:</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setHoverRating(i + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i + 1)}
                  className="transition"
                >
                  <Star
                    className={`h-5 w-5 ${
                      i < (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-700 hover:text-gray-500"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
            className="w-full resize-none rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500/30"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || rating === 0}
              className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-cyan-500 disabled:opacity-40"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className={`flex-1 overflow-y-auto ${maxHeight}`}>
        {reviews.length === 0 ? (
          <div className="flex h-48 items-center justify-center">
            <p className="text-sm text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onLike={onLike ? () => onLike(review.id) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
