"use client";

import { useState } from "react";
import { BookOpen, Edit3, ArrowLeft, Save, X, Search, Tag } from "lucide-react";

interface WikiArticle {
  id: string;
  title: string;
  content: string;
  tags: string[];
  updatedAt: string;
}

const DEFAULT_ARTICLES: WikiArticle[] = [
  {
    id: "getting-started",
    title: "Getting Started with Injective Creator Hub",
    content:
      "Welcome to the Injective Creator Hub — a decentralized content creation platform built on Injective EVM. To get started, connect your wallet (MetaMask or WalletConnect), get testnet tokens from the faucet, and explore active campaigns. You can submit content, vote on submissions, and earn USDC rewards — all on-chain with near-zero gas fees.",
    tags: ["onboarding", "wallet", "basics"],
    updatedAt: "2026-06-20",
  },
  {
    id: "wallet-setup",
    title: "Wallet Setup Guide",
    content:
      "To interact with Injective Creator Hub, you need an EVM-compatible wallet. We recommend MetaMask. Add the Injective EVM network: Network Name: Injective EVM, RPC URL: https://k8s.testnet.json-rpc.injective.network, Chain ID: 1439, Currency Symbol: INJ. Once connected, request testnet tokens from the faucet to cover gas fees.",
    tags: ["wallet", "metamask", "setup"],
    updatedAt: "2026-06-18",
  },
  {
    id: "submit-content",
    title: "How to Submit Content",
    content:
      "Browse the Campaign Explorer to find active campaigns. Click on a campaign to view its brief, requirements, and deadline. Click 'Submit' and provide your content — this can be a tweet link, article URL, video, or any format specified in the brief. Confirm the on-chain transaction and your submission enters the voting pool.",
    tags: ["submission", "campaigns", "content"],
    updatedAt: "2026-06-22",
  },
  {
    id: "voting-mechanism",
    title: "Voting Mechanism Explained",
    content:
      "Any wallet holder can vote on submissions. Each vote is an on-chain transaction with near-zero gas fees. Votes are weighted by voter reputation — higher reputation means more influence. The final ranking determines reward distribution. Voting opens after the campaign deadline and closes after the voting period ends.",
    tags: ["voting", "reputation", "mechanism"],
    updatedAt: "2026-06-15",
  },
  {
    id: "rewards-streaming",
    title: "Real-Time Rewards Streaming",
    content:
      "Inspired by Superfluid protocol, your rewards flow to your wallet every second while a campaign is active. Watch your balance tick up in real-time on the dashboard — like a taxi meter for your creativity. All payouts are in USDC on Injective EVM, settled automatically after campaign completion.",
    tags: ["rewards", "streaming", "usdc"],
    updatedAt: "2026-06-19",
  },
];

export function Wiki() {
  const [articles] = useState<WikiArticle[]>(DEFAULT_ARTICLES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const selected = articles.find((a) => a.id === selectedId) ?? null;

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEdit = (article: WikiArticle) => {
    setEditingId(article.id);
    setEditContent(article.content);
  };

  const handleSave = () => {
    // In a real app this would persist; here we just exit edit mode
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  // Article detail view
  if (selected) {
    return (
      <section className="space-y-6">
        <button
          onClick={() => {
            setSelectedId(null);
            setEditingId(null);
          }}
          className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to articles
        </button>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-cyan-400" />
                <span className="text-xs text-gray-500">
                  Updated {selected.updatedAt}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{selected.title}</h2>
              <div className="flex flex-wrap gap-2">
                {selected.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.04] px-2.5 py-0.5 text-xs text-gray-400"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {editingId !== selected.id && (
              <button
                onClick={() => handleEdit(selected)}
                className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/[0.08]"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Edit
              </button>
            )}
          </div>

          {editingId === selected.id ? (
            <div className="mt-4 space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={8}
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.04] p-4 text-sm text-gray-300 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-cyan-500"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/[0.08]"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-4 leading-relaxed text-gray-400">{selected.content}</p>
          )}
        </div>
      </section>
    );
  }

  // Article list view
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Wiki</h2>
        <p className="text-sm text-gray-400">
          Guides, documentation, and how-tos for the Injective Creator Hub.
        </p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search articles or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
        />
      </div>

      <div className="grid gap-3">
        {filtered.map((article) => (
          <button
            key={article.id}
            onClick={() => setSelectedId(article.id)}
            className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-left transition hover:bg-white/[0.04]"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs text-gray-500">
                    {article.updatedAt}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300">
                  {article.title}
                </h3>
                <p className="line-clamp-2 text-xs text-gray-500">
                  {article.content}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/[0.06] bg-white/[0.04] px-2 py-0.5 text-[10px] text-gray-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
            <Search className="mx-auto h-8 w-8 text-gray-600" />
            <p className="mt-2 text-sm text-gray-500">
              No articles match your search.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
