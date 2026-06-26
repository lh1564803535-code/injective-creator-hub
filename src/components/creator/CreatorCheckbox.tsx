"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

// --- Types ---

type SkillTag = "writing" | "video" | "design" | "code" | "marketing" | "community" | "research" | "translation";
type NotificationPref = "campaign_new" | "campaign_end" | "reward_paid" | "submission_vote" | "achievement_unlocked" | "weekly_digest";
type PrivacySetting = "show_earnings" | "show_badges" | "show_activity" | "show_profile" | "allow_messages";

interface CreatorCheckboxProps {
  selectedSkills: SkillTag[];
  onSkillsChange: (skills: SkillTag[]) => void;
  selectedNotifications: NotificationPref[];
  onNotificationsChange: (prefs: NotificationPref[]) => void;
  selectedPrivacy: PrivacySetting[];
  onPrivacyChange: (settings: PrivacySetting[]) => void;
  disabled?: boolean;
}

// --- Options ---

const SKILL_TAGS: { value: SkillTag; label: string; desc: string }[] = [
  { value: "writing", label: "文案写作", desc: "文章、推文、活动文案" },
  { value: "video", label: "视频制作", desc: "短视频、教程、直播" },
  { value: "design", label: "视觉设计", desc: "海报、UI、品牌设计" },
  { value: "code", label: "技术开发", desc: "智能合约、DApp、工具" },
  { value: "marketing", label: "营销推广", desc: "增长、运营、投放" },
  { value: "community", label: "社区运营", desc: "Discord、Telegram 管理" },
  { value: "research", label: "研究报告", desc: "行业分析、项目研报" },
  { value: "translation", label: "翻译本地化", desc: "多语言翻译和适配" },
];

const NOTIFICATION_PREFS: { value: NotificationPref; label: string; desc: string }[] = [
  { value: "campaign_new", label: "新活动发布", desc: "有新活动上线时通知" },
  { value: "campaign_end", label: "活动即将结束", desc: "活动截止前提醒" },
  { value: "reward_paid", label: "奖励发放", desc: "奖励到账时通知" },
  { value: "submission_vote", label: "投票动态", desc: "作品收到投票时通知" },
  { value: "achievement_unlocked", label: "成就解锁", desc: "获得新成就时通知" },
  { value: "weekly_digest", label: "周报摘要", desc: "每周活动和收益汇总" },
];

const PRIVACY_SETTINGS: { value: PrivacySetting; label: string; desc: string }[] = [
  { value: "show_earnings", label: "公开收益", desc: "其他用户可以查看你的收益" },
  { value: "show_badges", label: "公开徽章", desc: "在个人资料展示获得的徽章" },
  { value: "show_activity", label: "公开活动记录", desc: "展示参与过的活动历史" },
  { value: "show_profile", label: "公开个人资料", desc: "允许其他用户查看你的资料" },
  { value: "allow_messages", label: "允许私信", desc: "其他用户可以向你发送私信" },
];

// --- Helper: single option row ---

interface OptionRowProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  desc: string;
  disabled?: boolean;
  accentColor?: "cyan" | "amber" | "green";
}

function OptionRow({ checked, onChange, label, desc, disabled, accentColor = "cyan" }: OptionRowProps) {
  const accent = {
    cyan: { border: "border-cyan-500/30", bg: "bg-cyan-500/10" },
    amber: { border: "border-amber-500/30", bg: "bg-amber-500/10" },
    green: { border: "border-green-500/30", bg: "bg-green-500/10" },
  }[accentColor];

  return (
    <label
      className={`group flex items-start gap-3 rounded-lg border p-3 transition-all duration-200 cursor-pointer ${
        checked
          ? `${accent.border} ${accent.bg}`
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

export function CreatorCheckbox({
  selectedSkills,
  onSkillsChange,
  selectedNotifications,
  onNotificationsChange,
  selectedPrivacy,
  onPrivacyChange,
  disabled = false,
}: CreatorCheckboxProps) {
  // toggle helpers
  const toggleSkill = (val: SkillTag, checked: boolean) => {
    onSkillsChange(
      checked ? [...selectedSkills, val] : selectedSkills.filter((v) => v !== val)
    );
  };
  const toggleNotification = (val: NotificationPref, checked: boolean) => {
    onNotificationsChange(
      checked ? [...selectedNotifications, val] : selectedNotifications.filter((v) => v !== val)
    );
  };
  const togglePrivacy = (val: PrivacySetting, checked: boolean) => {
    onPrivacyChange(
      checked ? [...selectedPrivacy, val] : selectedPrivacy.filter((v) => v !== val)
    );
  };

  // select-all state
  const allSkills = SKILL_TAGS.map((s) => s.value);
  const allNotifications = NOTIFICATION_PREFS.map((n) => n.value);
  const allPrivacy = PRIVACY_SETTINGS.map((p) => p.value);

  const skillsAll = selectedSkills.length === allSkills.length;
  const skillsPartial = selectedSkills.length > 0 && !skillsAll;
  const notifsAll = selectedNotifications.length === allNotifications.length;
  const notifsPartial = selectedNotifications.length > 0 && !notifsAll;
  const privacyAll = selectedPrivacy.length === allPrivacy.length;
  const privacyPartial = selectedPrivacy.length > 0 && !privacyAll;

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 space-y-6">
      <h3 className="text-sm font-medium text-white/70">创作者偏好</h3>

      {/* Skill Tags */}
      <fieldset disabled={disabled}>
        <legend className="text-sm font-medium text-white/60 mb-3">技能标签</legend>
        <SelectAllBar
          isAll={skillsAll}
          isPartial={skillsPartial}
          onSelectAll={() => onSkillsChange(skillsAll ? [] : allSkills)}
          selectedCount={selectedSkills.length}
          totalCount={allSkills.length}
        />
        <div className="grid sm:grid-cols-2 gap-3 mt-2">
          {SKILL_TAGS.map((opt) => (
            <OptionRow
              key={opt.value}
              checked={selectedSkills.includes(opt.value)}
              onChange={(c) => toggleSkill(opt.value, c)}
              label={opt.label}
              desc={opt.desc}
              disabled={disabled}
            />
          ))}
        </div>
      </fieldset>

      <div className="h-px bg-white/[0.06]" />

      {/* Notification Preferences */}
      <fieldset disabled={disabled}>
        <legend className="text-sm font-medium text-white/60 mb-3">通知偏好</legend>
        <SelectAllBar
          isAll={notifsAll}
          isPartial={notifsPartial}
          onSelectAll={() => onNotificationsChange(notifsAll ? [] : allNotifications)}
          selectedCount={selectedNotifications.length}
          totalCount={allNotifications.length}
        />
        <div className="grid sm:grid-cols-2 gap-3 mt-2">
          {NOTIFICATION_PREFS.map((opt) => (
            <OptionRow
              key={opt.value}
              checked={selectedNotifications.includes(opt.value)}
              onChange={(c) => toggleNotification(opt.value, c)}
              label={opt.label}
              desc={opt.desc}
              disabled={disabled}
              accentColor="amber"
            />
          ))}
        </div>
      </fieldset>

      <div className="h-px bg-white/[0.06]" />

      {/* Privacy Settings */}
      <fieldset disabled={disabled}>
        <legend className="text-sm font-medium text-white/60 mb-3">隐私设置</legend>
        <SelectAllBar
          isAll={privacyAll}
          isPartial={privacyPartial}
          onSelectAll={() => onPrivacyChange(privacyAll ? [] : allPrivacy)}
          selectedCount={selectedPrivacy.length}
          totalCount={allPrivacy.length}
        />
        <div className="grid sm:grid-cols-2 gap-3 mt-2">
          {PRIVACY_SETTINGS.map((opt) => (
            <OptionRow
              key={opt.value}
              checked={selectedPrivacy.includes(opt.value)}
              onChange={(c) => togglePrivacy(opt.value, c)}
              label={opt.label}
              desc={opt.desc}
              disabled={disabled}
              accentColor="green"
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
}
