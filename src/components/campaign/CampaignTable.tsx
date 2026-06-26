"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  DollarSign,
  Clock,
  Users,
  Trophy,
} from "lucide-react";
import { Table, type TableColumn, type SortState } from "@/components/ui/Table";
import { formatUSDC, shortenAddress, getCampaignStatus } from "@/lib/injective";
import type { Campaign, CampaignStatus } from "@/types/creator-settlement";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CampaignSortKey = "totalReward" | "deadline" | "submissionCount";

interface CampaignTableProps {
  campaigns: Campaign[];
  onRowClick?: (campaign: Campaign) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDeadline(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = timestamp - now;
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;
  const minutes = Math.floor((diff % 3600) / 60);
  return `${minutes}m`;
}

function StatusBadge({ status }: { status: CampaignStatus }) {
  const styles: Record<CampaignStatus, { bg: string; text: string; dot: string }> = {
    active: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      dot: "bg-emerald-400",
    },
    voting: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      dot: "bg-amber-400",
    },
    ended: {
      bg: "bg-gray-500/10",
      text: "text-gray-400",
      dot: "bg-gray-400",
    },
  };
  const s = styles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CampaignTable({ campaigns, onRowClick }: CampaignTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "all">("all");
  const [sort, setSort] = useState<SortState>({
    key: "deadline",
    direction: "asc",
  });

  // Filter
  const filtered = useMemo(() => {
    let result = campaigns;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.sponsor.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (c) => getCampaignStatus(c.deadline, c.settled) === statusFilter
      );
    }

    return result;
  }, [campaigns, search, statusFilter]);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<CampaignStatus | "all", number> = {
      all: campaigns.length,
      active: 0,
      voting: 0,
      ended: 0,
    };
    campaigns.forEach((c) => {
      counts[getCampaignStatus(c.deadline, c.settled)]++;
    });
    return counts;
  }, [campaigns]);

  // Columns
  const columns: TableColumn<Campaign>[] = [
    {
      key: "title",
      header: "Campaign",
      sortable: true,
      width: "35%",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
            <Trophy className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-white">{item.title}</p>
            <p className="truncate text-xs text-gray-500">
              {shortenAddress(item.sponsor)}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "totalReward",
      header: "Reward",
      sortable: true,
      width: "15%",
      align: "right",
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-semibold text-emerald-400">
            {formatUSDC(item.totalReward)}
          </span>
          <span className="text-xs text-gray-500">USDC</span>
        </div>
      ),
    },
    {
      key: "deadline",
      header: "Deadline",
      sortable: true,
      width: "15%",
      render: (item) => {
        const status = getCampaignStatus(item.deadline, item.settled);
        return (
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gray-500" />
            <span
              className={
                status === "ended"
                  ? "text-gray-500"
                  : status === "voting"
                    ? "text-amber-400"
                    : "text-gray-300"
              }
            >
              {formatDeadline(item.deadline)}
            </span>
          </div>
        );
      },
    },
    {
      key: "submissionCount",
      header: "Submissions",
      sortable: true,
      width: "12%",
      align: "center",
      render: (item) => (
        <div className="flex items-center justify-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-gray-500" />
          <span className="text-gray-300">{item.submissionCount}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "12%",
      render: (item) => (
        <StatusBadge status={getCampaignStatus(item.deadline, item.settled)} />
      ),
    },
  ];

  // Status filter tabs
  const statusTabs: { key: CampaignStatus | "all"; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "voting", label: "Voting" },
    { key: "ended", label: "Ended" },
  ];

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-b border-white/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Campaigns</h3>
          <p className="text-sm text-gray-500">
            {filtered.length} of {campaigns.length} campaigns
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campaigns..."
              className="h-9 w-48 rounded-lg border border-white/[0.08] bg-white/[0.04] pl-9 pr-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-cyan-500/40 focus:bg-white/[0.06]"
            />
          </div>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 border-b border-white/[0.06] px-5">
        <Filter className="mr-2 h-4 w-4 text-gray-500" />
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`border-b-2 px-3 py-2.5 text-xs font-medium transition ${
              statusFilter === tab.key
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-[10px] text-gray-600">
              {statusCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <Table<Campaign>
        columns={columns}
        data={filtered}
        sort={sort}
        onSortChange={setSort}
        onRowClick={onRowClick}
        pageSize={10}
        zebra
        emptyMessage="No campaigns found"
        rowKey={(item) => item.id}
      />
    </div>
  );
}
