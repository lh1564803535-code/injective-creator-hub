"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

// --- Types ---

type CampaignType = "content" | "social" | "referral" | "community" | "event";
type RewardType = "usdc" | "token" | "nft" | "points" | "badge";
type ParticipationMethod = "submit" | "vote" | "share" | "stake" | "invite";

interface CampaignCheckboxProps {
  selectedTypes: CampaignType[];
  onTypesChange: (types: CampaignType[]) => void;
  selectedRewards: RewardType[];
  onRewardsChange: (rewards: RewardType[]) => void;
  selectedMethods: ParticipationMethod[];
  onMethodsChange: (methods: ParticipationMethod[]) => void;
  disabled?: boolean;
}

// --- Options ---

const CAMPAIGN_TYPES: { value: CampaignType; label: string; desc: string }[] = [
  { value: "content", label: "内容创作", desc: "创作文章、视频、图片等内容" },
  { value: "social", label: "社媒推广", desc: "在社交平台推广活动" },
  { value: "referral", label: "邀请裂变", desc: "邀请好友参与获得奖励" },
  { value: "community", label: "社区贡献", desc: "参与社区治理和建设" },
  { value: "event", label: "线下活动", desc: "参与线下见面会、黑客松" },
];

const REWARD_TYPES: { value: RewardType; label: string; desc: string }[] = [
  { value: "usdc", label: "USDC", desc: "稳定币直接发放" },
  { value: "token", label: "INJ 代币", desc: "Injective 原生代币奖励" },
  { value: "nft", label: "NFT 徽章", desc: "链上不可篡改的成就证明" },
  { value: "points", label: "积分", desc: "可兑换奖励的平台积分" },
  { value: "badge", label: "荣誉勋章", desc: "展示在个人资料的特殊标识" },
];

const PARTICIPATION_METHODS: { value: ParticipationMethod; label: string; desc: string }[] = [
  { value: "submit", label: "提交作品", desc: "上传内容参与评选" },
  { value: "vote", label: "社区投票", desc: "为其他参与者投票" },
  { value: "share", label: "社交分享", desc: "分享活动到社交平台" },
  { value: "stake", label: "质押参与", desc: "质押代币获得参与资格" },
  { value: "invite", label: "邀请好友", desc: "邀请新用户参与活动" },
];

// --- Color maps ---

const TYPE_COLORS: Record<CampaignType, { border: string; bg: string; badge: string }> = {
  content: { border: "border-cyan-500/30", bg: "bg-cyan-500/10", badge: "bg-cyan-500/20 text-cyan-400" },
  social: { border: "border-blue-500/30", bg: "bg-blue-500/10", badge: "bg-blue-500/20 text-blue-400" },
  referral: { border: "border-purple-500/30", bg: "bg-purple-500/10", badge: "bg-purple-500/20 text-purple-400" },
  community: { border: "border-green-500/30", bg: "bg-green-500/10", badge: "bg-green-500/20 text-green-400" },
  event: { border: "border-orange-500/30", bg: "bg-orange-500/10", badge: "bg-orange-500/20 text-orange-400" },
};

const REWARD_COLORS: Record<RewardType, { border: string; bg: string }> = {
  usdc: { border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
  token: { border: "border-yellow-500/30", bg: "bg-yellow-500/10" },
  nft: { border: "border-pink-500/30", bg: "bg-pink-500/10" },
  points: { border: "border-violet-500/30", bg: "bg-violet-500/10" },
  badge: { border: "border-amber-500/30", bg: "bg-amber-500/10" },
};

// --- Helper: single option row ---

interface OptionRowProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  desc: string;
  colors: { border: string; bg: string };
  disabled?: boolean;
}

function OptionRow({ checked, onChange, label, desc, colors, disabled }: OptionRowProps) {
  return (
    <label
      className={`group flex items-start gap-3 rounded-lg border p-3 transition-all duration-200 cursor-pointer ${
        checked
          ? `${colors.border} ${colors.bg}`
          : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]"
      } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      <div className="relative mt-0.5 flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-white/[0.06] bg-white/[0.02] transition-all duration-200 checked:border-cyan-500 checked:bg-cyan-500/20"
        />
        <Check className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 text-cyan-400 opacity-0 scale-75 transition-all duration-200 peer-checked:opacity-100 peer-checked:scale-100" />
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-sm ${checked ? "text-white" : "text-white/70 group-hover:text-white/90"}`}>
          {label}
        </span>
        <p className="mt-0.5 text-xs text-white/30">{desc}</p>
      </div>
    </label>
  );
}

// --- Helper: select all ---

interface SelectAllBarProps {
  isAll: boolean;
  isPartial: boolean;
  onSelectAll: () => void;
  selectedCount: number;
  totalCount: number;
}

function SelectAllBar({ isAll, isPartial, onSelectAll, selectedCount, totalCount }: SelectAllBarProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = isPartial;
  }, [isPartial]);

  return (
    <label className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-white/[0.02] transition-colors rounded-lg">
      <div className="relative flex-shrink-0">
        <input
          ref={ref}
          type="checkbox"
          checked={isAll}
          onChange={onSelectAll}
          className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-white/[0.06] bg-white/[0.02] transition-all duration-200 checked:border-cyan-500 checked:bg-cyan-500/20"
        />
        <Check className="pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 text-cyan-400 opacity-0 scale-75 transition-all duration-200 peer-checked:opacity-100 peer-checked:scale-100" />
      </div>
      <span className="text-xs text-white/50">全选</span>
      <span className="ml-auto text-xs text-white/30">{selectedCount}/{totalCount}</span>
    </label>
  );
}

// --- Main Component ---

export function CampaignCheckbox({
  selectedTypes,
  onTypesChange,
  selectedRewards,
  onRewardsChange,
  selectedMethods,
  onMethodsChange,
  disabled = false,
}: CampaignCheckboxProps) {
  const toggleType = (val: CampaignType, checked: boolean) => {
    onTypesChange(
      checked ? [...selectedTypes, val] : selectedTypes.filter((v) => v !== val)
    );
  };
  const toggleReward = (val: RewardType, checked: boolean) => {
    onRewardsChange(
      checked ? [...selectedRewards, val] : selectedRewards.filter((v) => v !== val)
    );
  };
  const toggleMethod = (val: ParticipationMethod, checked: boolean) => {
    onMethodsChange(
      checked ? [...selectedMethods, val] : selectedMethods.filter((v) => v !== val)
    );
  };

  // select-all helpers
  const allTypeValues = CAMPAIGN_TYPES.map((t) => t.value);
  const allRewardValues = REWARD_TYPES.map((r) => r.value);
  const allMethodValues = PARTICIPATION_METHODS.map((m) => m.value);

  const typesAll = selectedTypes.length === allTypeValues.length;
  const typesPartial = selectedTypes.length > 0 && !typesAll;
  const rewardsAll = selectedRewards.length === allRewardValues.length;
  const rewardsPartial = selectedRewards.length > 0 && !rewardsAll;
  const methodsAll = selectedMethods.length === allMethodValues.length;
  const methodsPartial = selectedMethods.length > 0 && !methodsAll;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 space-y-6">
      <h3 className="text-sm font-medium text-white/70">活动选项</h3>

      {/* Campaign Types */}
      <fieldset disabled={disabled}>
        <legend className="text-sm font-medium text-white/60 mb-3">活动类型</legend>
        <SelectAllBar
          isAll={typesAll}
          isPartial={typesPartial}
          onSelectAll={() => onTypesChange(typesAll ? [] : allTypeValues)}
          selectedCount={selectedTypes.length}
          totalCount={allTypeValues.length}
        />
        <div className="grid sm:grid-cols-2 gap-3 mt-2">
          {CAMPAIGN_TYPES.map((opt) => (
            <OptionRow
              key={opt.value}
              checked={selectedTypes.includes(opt.value)}
              onChange={(c) => toggleType(opt.value, c)}
              label={opt.label}
              desc={opt.desc}
              colors={TYPE_COLORS[opt.value]}
              disabled={disabled}
            />
          ))}
        </div>
      </fieldset>

      <div className="h-px bg-white/[0.06]" />

      {/* Reward Types */}
      <fieldset disabled={disabled}>
        <legend className="text-sm font-medium text-white/60 mb-3">奖励类型</legend>
        <SelectAllBar
          isAll={rewardsAll}
          isPartial={rewardsPartial}
          onSelectAll={() => onRewardsChange(rewardsAll ? [] : allRewardValues)}
          selectedCount={selectedRewards.length}
          totalCount={allRewardValues.length}
        />
        <div className="grid sm:grid-cols-2 gap-3 mt-2">
          {REWARD_TYPES.map((opt) => (
            <OptionRow
              key={opt.value}
              checked={selectedRewards.includes(opt.value)}
              onChange={(c) => toggleReward(opt.value, c)}
              label={opt.label}
              desc={opt.desc}
              colors={REWARD_COLORS[opt.value]}
              disabled={disabled}
            />
          ))}
        </div>
      </fieldset>

      <div className="h-px bg-white/[0.06]" />

      {/* Participation Methods */}
      <fieldset disabled={disabled}>
        <legend className="text-sm font-medium text-white/60 mb-3">参与方式</legend>
        <SelectAllBar
          isAll={methodsAll}
          isPartial={methodsPartial}
          onSelectAll={() => onMethodsChange(methodsAll ? [] : allMethodValues)}
          selectedCount={selectedMethods.length}
          totalCount={allMethodValues.length}
        />
        <div className="grid sm:grid-cols-2 gap-3 mt-2">
          {PARTICIPATION_METHODS.map((opt) => (
            <OptionRow
              key={opt.value}
              checked={selectedMethods.includes(opt.value)}
              onChange={(c) => toggleMethod(opt.value, c)}
              label={opt.label}
              desc={opt.desc}
              colors={{ border: "border-white/[0.1]", bg: "bg-white/[0.04]" }}
              disabled={disabled}
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
}
