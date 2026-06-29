"use client";

import { useState, useMemo } from "react";
import {useTranslations} from 'next-intl';
import { Trophy, TrendingUp, FileText, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { LeaderboardTable } from "@/components/creator/LeaderboardTable";
import {
  CampaignSearch,
  type CampaignStatusFilter,
  type CampaignSortBy,
} from "@/components/campaign/CampaignSearch";
import type { Creator, LeaderboardSortBy } from "@/types/creator-settlement";
import { MOCK_CREATORS, MOCK_CAMPAIGNS, MOCK_SUBMISSIONS } from "@/lib/mock-data";

const PAGE_SIZE = 10;

export default function LeaderboardPage() {
  const t = useTranslations('leaderboard');
  const [creators] = useState<Creator[]>(MOCK_CREATORS);
  const [sortBy, setSortBy] = useState<LeaderboardSortBy>("earnings");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // CampaignSearch state (used for filtering creators by campaign participation)
  const [statusFilter, setStatusFilter] = useState<CampaignStatusFilter>("all");
  const [campaignSortBy, setCampaignSortBy] = useState<CampaignSortBy>("reward");
  const [campaignFilter, setCampaignFilter] = useState("all");

  // Build set of creator addresses that participated in the filtered campaign
  const campaignCreatorAddresses = useMemo(() => {
    if (campaignFilter === "all") return null; // no filter
    const cid = Number(campaignFilter);
    const subs = MOCK_SUBMISSIONS[cid] ?? [];
    return new Set(subs.map((s: {creator: string}) => s.creator.toLowerCase()));
  }, [campaignFilter]);

  // Filter creators based on search + campaign filter
  const filteredCreators = creators.filter((creator) => {
    const matchesSearch = creator.address.toLowerCase().includes(search.toLowerCase());
    const matchesCampaign = campaignCreatorAddresses === null
      ? true
      : campaignCreatorAddresses.has(creator.address.toLowerCase());
    return matchesSearch && matchesCampaign;
  });

  // Sort creators
  const sortedCreators = [...filteredCreators].sort((a, b) => {
    switch (sortBy) {
      case "earnings":
        return Number(b.earnings - a.earnings);
      case "votes":
        return (b as any).totalVotes - (a as any).totalVotes;
      case "submissions":
        return b.submissions - a.submissions;
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedCreators.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedCreators = sortedCreators.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Re-rank paginated creators based on their position in the sorted list
  const rankedCreators = paginatedCreators.map((c, i) => ({
    ...c,
    rank: (currentPage - 1) * PAGE_SIZE + i + 1,
  }));

  // Calculate stats
  const totalEarnings = creators.reduce(
    (sum, c) => sum + c.earnings,
    0
  );
  const totalVotes = creators.reduce((sum, c) => sum + ((c as any).totalVotes ?? 0), 0);
  const totalSubmissions = creators.reduce(
    (sum, c) => sum + c.submissions,
    0
  );

  // Campaign options for filter dropdown
  const campaignOptions = MOCK_CAMPAIGNS.map((c) => ({
    id: c.id,
    title: c.title,
  }));

  // Mock CSV export
  function handleExportCSV() {
    const header = "Rank,Address,Earnings (USDC),Votes,Submissions\n";
    const rows = sortedCreators
      .map(
        (c, i) =>
          `${i + 1},${c.address},${c.earnings.toFixed(2)},${(c as any).totalVotes ?? 0},${c.submissions}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leaderboard.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 text-xl font-bold text-[#EAECEF]">{t('title')}</h1>
          <p className="text-sm text-[#848E9C]">
            {t('subtitle')}
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 rounded-lg border border-[#2B3139] bg-[#1E2329] px-4 py-2.5 text-sm font-medium text-[#EAECEF] transition hover:bg-[#2B3139]"
        >
          <Download className="h-4 w-4" />
          {t('exportCSV')}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#2B3139] bg-[#1E2329] p-5">
          <div className="mb-2 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#F0B90B]" />
            <span className="text-sm text-[#848E9C]">{t('totalEarnings')}</span>
          </div>
          <p className="font-mono text-2xl font-bold text-[#EAECEF]">
            {(Number(totalEarnings) / 1e6).toLocaleString()} USDC
          </p>
        </div>
        <div className="rounded-xl border border-[#2B3139] bg-[#1E2329] p-5">
          <div className="mb-2 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#00D4AA]" />
            <span className="text-sm text-[#848E9C]">{t('totalVotes')}</span>
          </div>
          <p className="font-mono text-2xl font-bold text-[#EAECEF]">
            {totalVotes.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl border border-[#2B3139] bg-[#1E2329] p-5">
          <div className="mb-2 flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#848E9C]" />
            <span className="text-sm text-[#848E9C]">{t('totalWorks')}</span>
          </div>
          <p className="font-mono text-2xl font-bold text-[#EAECEF]">{totalSubmissions}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-6">
        <CampaignSearch
          search={search}
          onSearchChange={(v) => { setSearch(v); setPage(1); }}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={campaignSortBy}
          onSortByChange={setCampaignSortBy}
          campaignFilter={campaignFilter}
          onCampaignFilterChange={(v) => { setCampaignFilter(v); setPage(1); }}
          campaignOptions={campaignOptions}
          showCampaignFilter
        />
      </div>

      {/* Leaderboard Table */}
      <LeaderboardTable />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-[#2B3139] bg-[#1E2329] px-4 py-3">
          <p className="text-sm text-[#848E9C]">
            {t('showing')} {(currentPage - 1) * PAGE_SIZE + 1}-
            {Math.min(currentPage * PAGE_SIZE, sortedCreators.length)} {t('of')}{" "}
            {sortedCreators.length} {t('creators')}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2B3139] bg-[#0B0E11] text-[#848E9C] transition hover:bg-[#2B3139] hover:text-[#EAECEF] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition ${
                  p === currentPage
                    ? "bg-[#00D4AA]/15 text-[#00D4AA] border border-[#00D4AA]/30"
                    : "border border-[#2B3139] bg-[#0B0E11] text-[#848E9C] hover:bg-[#2B3139] hover:text-[#EAECEF]"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2B3139] bg-[#0B0E11] text-[#848E9C] transition hover:bg-[#2B3139] hover:text-[#EAECEF] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
