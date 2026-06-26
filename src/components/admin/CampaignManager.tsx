"use client";

import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Clock,
  CheckCircle2,
  Vote,
  X,
  Loader2,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";
import type {
  Campaign,
  CampaignStatus,
  CampaignWithStatus,
  CreateCampaignForm,
  Submission,
} from "@/types/creator-settlement";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_CAMPAIGNS: CampaignWithStatus[] = [
  {
    id: 1,
    sponsor: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e",
    title: "XHunt Content Sprint",
    description: "Create viral content about Injective's XHunt ecosystem.",
    totalReward: BigInt(5000000000),
    deadline: Math.floor(Date.now() / 1000) + 86400 * 5,
    submissionCount: 23,
    settled: false,
    status: "active",
    timeRemaining: "5d 12h",
  },
  {
    id: 2,
    sponsor: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e",
    title: "DeFi Explainer Series",
    description: "Educational content about DeFi on Injective.",
    totalReward: BigInt(3000000000),
    deadline: Math.floor(Date.now() / 1000) + 86400 * 2,
    submissionCount: 45,
    settled: false,
    status: "voting",
    timeRemaining: "2d 6h",
  },
  {
    id: 3,
    sponsor: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e",
    title: "NFT Art Challenge",
    description: "Create NFT artwork themed around Injective blockchain.",
    totalReward: BigInt(8000000000),
    deadline: Math.floor(Date.now() / 1000) - 86400 * 3,
    submissionCount: 67,
    settled: true,
    status: "ended",
    timeRemaining: "Ended",
  },
];

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 1,
    campaignId: 1,
    creator: "0xAbC1234567890aBcDeF1234567890aBcDeF1234",
    contentURI: "ipfs://Qm123...",
    votes: 128,
    reward: BigInt(1000000000),
    claimed: true,
  },
  {
    id: 2,
    campaignId: 1,
    creator: "0xDeF4567890123dEfAbC4567890123dEfAbC4567",
    contentURI: "ipfs://Qm456...",
    votes: 96,
    reward: BigInt(500000000),
    claimed: false,
  },
  {
    id: 3,
    campaignId: 2,
    creator: "0x789aBcDeF0123456789aBcDeF0123456789aBcDe",
    contentURI: "ipfs://Qm789...",
    votes: 210,
    reward: BigInt(0),
    claimed: false,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatReward(wei: bigint): string {
  return (Number(wei) / 1e9).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function shortenAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CampaignManager() {
  const [campaigns, setCampaigns] = useState<CampaignWithStatus[]>(MOCK_CAMPAIGNS);
  const [filter, setFilter] = useState<CampaignStatus | "all">("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignWithStatus | null>(null);
  const [viewingSubmissions, setViewingSubmissions] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState<CreateCampaignForm>({
    title: "",
    description: "",
    totalReward: "",
    duration: 7 * 86400,
  });

  const filtered =
    filter === "all" ? campaigns : campaigns.filter((c) => c.status === filter);

  const statusCounts = {
    all: campaigns.length,
    active: campaigns.filter((c) => c.status === "active").length,
    voting: campaigns.filter((c) => c.status === "voting").length,
    ended: campaigns.filter((c) => c.status === "ended").length,
  };

  // ---- Handlers ----

  const handleCreate = async () => {
    if (!form.title || !form.totalReward) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));

    const now = Math.floor(Date.now() / 1000);
    const newCampaign: CampaignWithStatus = {
      id: campaigns.length + 1,
      sponsor: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e",
      title: form.title,
      description: form.description,
      totalReward: BigInt(Number(form.totalReward) * 1e9),
      deadline: now + form.duration,
      submissionCount: 0,
      settled: false,
      status: "active",
      timeRemaining: `${Math.floor(form.duration / 86400)}d`,
    };

    setCampaigns((prev) => [newCampaign, ...prev]);
    setForm({ title: "", description: "", totalReward: "", duration: 7 * 86400 });
    setShowCreateForm(false);
    setIsSubmitting(false);
  };

  const handleUpdate = async () => {
    if (!editingCampaign) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === editingCampaign.id
          ? { ...c, title: form.title, description: form.description }
          : c
      )
    );
    setEditingCampaign(null);
    setForm({ title: "", description: "", totalReward: "", duration: 7 * 86400 });
    setIsSubmitting(false);
  };

  const handleDelete = (id: number) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const startEdit = (campaign: CampaignWithStatus) => {
    setEditingCampaign(campaign);
    setForm({
      title: campaign.title,
      description: campaign.description,
      totalReward: formatReward(campaign.totalReward),
      duration: campaign.deadline - Math.floor(Date.now() / 1000),
    });
  };

  const submissionsForCampaign = MOCK_SUBMISSIONS.filter(
    (s) => s.campaignId === viewingSubmissions
  );

  // ---- Status badge ----

  const StatusBadge = ({ status }: { status: CampaignStatus }) => {
    const map: Record<CampaignStatus, { icon: typeof Clock; color: string; label: string }> = {
      active: { icon: Clock, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", label: "Active" },
      voting: { icon: Vote, color: "text-amber-400 bg-amber-500/10 border-amber-500/20", label: "Voting" },
      ended: { icon: CheckCircle2, color: "text-gray-400 bg-gray-500/10 border-gray-500/20", label: "Ended" },
    };
    const s = map[status];
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.color}`}>
        <s.icon className="h-3 w-3" />
        {s.label}
      </span>
    );
  };

  // ---- Render ----

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Campaign Manager</h3>
          <p className="text-sm text-gray-400">Create, edit, and manage campaigns</p>
        </div>
        <button
          onClick={() => {
            setShowCreateForm(true);
            setEditingCampaign(null);
            setForm({ title: "", description: "", totalReward: "", duration: 7 * 86400 });
          }}
          className="flex items-center gap-2 rounded-xl bg-cyan-500/15 px-4 py-2.5 text-sm font-medium text-cyan-300 transition-colors hover:bg-cyan-500/25"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 rounded-xl bg-white/[0.03] p-1">
        {(["all", "active", "voting", "ended"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              filter === s
                ? "bg-cyan-500/15 text-cyan-300 shadow-sm"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[10px]">
              {statusCounts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* Create / Edit form */}
      {(showCreateForm || editingCampaign) && (
        <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-medium text-white">
              {editingCampaign ? "Edit Campaign" : "Create New Campaign"}
            </h4>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setEditingCampaign(null);
              }}
              className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs text-gray-400">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Campaign title"
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-cyan-500/40"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-gray-400">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Campaign description"
                rows={3}
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-cyan-500/40"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs text-gray-400">Total Reward (USDC)</label>
                <input
                  type="number"
                  value={form.totalReward}
                  onChange={(e) => setForm((f) => ({ ...f, totalReward: e.target.value }))}
                  placeholder="5000"
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-cyan-500/40"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-gray-400">Duration (days)</label>
                <select
                  value={Math.floor(form.duration / 86400)}
                  onChange={(e) => setForm((f) => ({ ...f, duration: Number(e.target.value) * 86400 }))}
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-cyan-500/40"
                >
                  <option value={3}>3 days</option>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                </select>
              </div>
            </div>
            <button
              onClick={editingCampaign ? handleUpdate : handleCreate}
              disabled={isSubmitting || !form.title}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : editingCampaign ? (
                "Update Campaign"
              ) : (
                "Create Campaign"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Campaign table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1a1a1a]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-xs text-gray-500">
                <th className="px-5 py-3 font-medium">Campaign</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Reward</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">Submissions</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">Time Left</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                    No campaigns found
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">{c.title}</p>
                      <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">{c.description}</p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-medium text-emerald-400">
                        {formatReward(c.totalReward)} USDC
                      </span>
                    </td>
                    <td className="hidden px-5 py-4 sm:table-cell">
                      <span className="text-gray-300">{c.submissionCount}</span>
                    </td>
                    <td className="hidden px-5 py-4 md:table-cell">
                      <span className="text-gray-400">{c.timeRemaining}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingSubmissions(c.id)}
                          title="View submissions"
                          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-cyan-400"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => startEdit(c)}
                          title="Edit"
                          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-amber-400"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          title="Delete"
                          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submissions modal */}
      {viewingSubmissions !== null && (
        <div className="rounded-2xl border border-white/[0.06] bg-[#1a1a1a] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-medium text-white">
              Submissions for Campaign #{viewingSubmissions}
            </h4>
            <button
              onClick={() => setViewingSubmissions(null)}
              className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-xs text-gray-500">
                  <th className="px-4 py-2 font-medium">ID</th>
                  <th className="px-4 py-2 font-medium">Creator</th>
                  <th className="px-4 py-2 font-medium">Votes</th>
                  <th className="px-4 py-2 font-medium">Reward</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {submissionsForCampaign.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No submissions yet
                    </td>
                  </tr>
                ) : (
                  submissionsForCampaign.map((s) => (
                    <tr key={s.id} className="transition-colors hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-gray-400">#{s.id}</td>
                      <td className="px-4 py-3 font-mono text-gray-300">
                        {shortenAddress(s.creator)}
                      </td>
                      <td className="px-4 py-3 text-gray-300">{s.votes}</td>
                      <td className="px-4 py-3 text-emerald-400">
                        {s.reward > 0 ? `${formatReward(s.reward)} USDC` : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            s.claimed
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-gray-500/10 text-gray-400"
                          }`}
                        >
                          {s.claimed ? "Claimed" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
