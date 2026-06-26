"use client";

import { useState, useCallback } from "react";
import {
  MessageSquare,
  ThumbsUp,
  Send,
  ChevronDown,
  ChevronUp,
  User,
  Lightbulb,
  Star,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CreatorForumReply {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  likes: number;
  liked?: boolean;
  createdAt: number;
  isVerified?: boolean;
}

export interface CreatorForumPost {
  id: string;
  author: string;
  avatar?: string;
  title: string;
  content: string;
  likes: number;
  liked?: boolean;
  replies: CreatorForumReply[];
  createdAt: number;
  category?: "general" | "tips" | "showcase" | "collab";
  isVerified?: boolean;
}

interface CreatorForumProps {
  posts?: CreatorForumPost[];
  onNewPost?: (title: string, content: string, category: string) => void;
  onNewReply?: (postId: string, content: string) => void;
  onLike?: (postId: string, replyId?: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { value: "general", label: "General", color: "text-gray-400 bg-gray-500/10" },
  { value: "tips", label: "Tips & Tricks", color: "text-amber-400 bg-amber-500/10" },
  { value: "showcase", label: "Showcase", color: "text-purple-400 bg-purple-500/10" },
  { value: "collab", label: "Collab", color: "text-emerald-400 bg-emerald-500/10" },
] as const;

const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]));

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

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ReplyItem({
  reply,
  onLike,
}: {
  reply: CreatorForumReply;
  onLike?: () => void;
}) {
  return (
    <div className="flex gap-3 rounded-xl bg-white/[0.02] px-4 py-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-gray-400">
        {reply.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={reply.avatar} alt={reply.author} className="h-7 w-7 rounded-full object-cover" />
        ) : (
          <User className="h-3.5 w-3.5" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-white">{reply.author}</span>
          {reply.isVerified && <Star className="h-3 w-3 text-amber-400 fill-amber-400" />}
          <span className="text-[10px] text-gray-600">{formatRelativeTime(reply.createdAt)}</span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-gray-300 whitespace-pre-line">{reply.content}</p>
        <button
          onClick={onLike}
          className={`mt-2 inline-flex items-center gap-1.5 text-xs transition ${
            reply.liked ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <ThumbsUp className="h-3 w-3" />
          <span>{reply.likes}</span>
        </button>
      </div>
    </div>
  );
}

function PostCard({
  post,
  onReply,
  onLike,
  onLikeReply,
}: {
  post: CreatorForumPost;
  onReply?: (postId: string, content: string) => void;
  onLike?: (postId: string) => void;
  onLikeReply?: (postId: string, replyId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);

  const category = post.category ? CATEGORY_MAP[post.category] : undefined;

  const handleSubmitReply = useCallback(() => {
    const trimmed = replyText.trim();
    if (!trimmed || !onReply) return;
    onReply(post.id, trimmed);
    setReplyText("");
    setShowReplyInput(false);
  }, [onReply, post.id, replyText]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmitReply();
      }
    },
    [handleSubmitReply],
  );

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-5 transition hover:border-white/[0.1]">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-gray-400">
          {post.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.avatar} alt={post.author} className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <User className="h-4 w-4" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white">{post.author}</span>
            {post.isVerified && <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />}
            {category && (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${category.color}`}>
                {category.label}
              </span>
            )}
            <span className="text-[11px] text-gray-600">{formatRelativeTime(post.createdAt)}</span>
          </div>
          <h3 className="mt-0.5 text-base font-semibold text-white">{post.title}</h3>
        </div>
      </div>

      {/* Content */}
      <p className="mt-3 text-sm leading-relaxed text-gray-300 whitespace-pre-line">{post.content}</p>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-4 border-t border-white/[0.04] pt-3">
        <button
          onClick={() => onLike?.(post.id)}
          className={`inline-flex items-center gap-1.5 text-xs transition ${
            post.liked ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          <span>{post.likes}</span>
        </button>

        <button
          onClick={() => setShowReplyInput((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 transition hover:text-gray-300"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{post.replies.length} replies</span>
        </button>

        {post.replies.length > 0 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="ml-auto inline-flex items-center gap-1 text-[11px] text-gray-600 transition hover:text-gray-400"
          >
            {expanded ? (
              <>
                Hide <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Show replies <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Reply Input */}
      {showReplyInput && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2 focus-within:ring-1 focus-within:ring-cyan-500/30">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share your experience..."
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
          />
          <button
            onClick={handleSubmitReply}
            disabled={!replyText.trim()}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-600 text-white transition hover:bg-cyan-500 disabled:opacity-30"
            aria-label="Send reply"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Replies */}
      {expanded && post.replies.length > 0 && (
        <div className="mt-3 space-y-2 pl-6">
          {post.replies.map((reply) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              onLike={() => onLikeReply?.(post.id, reply.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function CreatorForum({
  posts = [],
  onNewPost,
  onNewReply,
  onLike,
  className = "",
}: CreatorForumProps) {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState("general");
  const [showNewPost, setShowNewPost] = useState(false);

  const handleNewPost = useCallback(() => {
    const t = postTitle.trim();
    const c = postContent.trim();
    if (!t || !c || !onNewPost) return;
    onNewPost(t, c, postCategory);
    setPostTitle("");
    setPostContent("");
    setPostCategory("general");
    setShowNewPost(false);
  }, [onNewPost, postCategory, postContent, postTitle]);

  return (
    <div className={`flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111] ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-semibold text-white">Creator Community</span>
          <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-gray-500">
            {posts.length}
          </span>
        </div>
        {onNewPost && (
          <button
            onClick={() => setShowNewPost((v) => !v)}
            className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-cyan-500"
          >
            {showNewPost ? "Cancel" : "New Post"}
          </button>
        )}
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <div className="border-b border-white/[0.06] bg-white/[0.02] p-4 space-y-3">
          {/* Category selector */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setPostCategory(cat.value)}
                className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
                  postCategory === cat.value
                    ? cat.color + " ring-1 ring-white/20"
                    : "bg-white/[0.04] text-gray-500 hover:bg-white/[0.06]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="Post title..."
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500/30"
          />
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Share your experience, tips, or start a collaboration..."
            rows={3}
            className="w-full resize-none rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500/30"
          />
          <div className="flex justify-end">
            <button
              onClick={handleNewPost}
              disabled={!postTitle.trim() || !postContent.trim()}
              className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-cyan-500 disabled:opacity-40"
            >
              Post
            </button>
          </div>
        </div>
      )}

      {/* Posts */}
      <div className="flex-1 overflow-y-auto max-h-[600px]">
        {posts.length === 0 ? (
          <div className="flex h-48 items-center justify-center">
            <p className="text-sm text-gray-500">No posts yet. Share your first experience!</p>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onReply={onNewReply}
                onLike={onLike ? (postId) => onLike(postId) : undefined}
                onLikeReply={onLike ? (postId, replyId) => onLike(postId, replyId) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
