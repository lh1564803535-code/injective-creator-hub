"use client";

import { Switch } from "@/components/ui/Switch";

interface CreatorSwitchProps {
  publicProfile: boolean;
  onPublicProfileToggle: (enabled: boolean) => void;
  notificationsEnabled: boolean;
  onNotificationsToggle: (enabled: boolean) => void;
  autoClaimRewards: boolean;
  onAutoClaimToggle: (enabled: boolean) => void;
  disabled?: boolean;
}

export function CreatorSwitch({
  publicProfile,
  onPublicProfileToggle,
  notificationsEnabled,
  onNotificationsToggle,
  autoClaimRewards,
  onAutoClaimToggle,
  disabled = false,
}: CreatorSwitchProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 space-y-4">
      <h3 className="text-sm font-medium text-white/70">创作者设置</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">公开资料</p>
            <p className="text-xs text-white/40 mt-0.5">
              其他用户可以查看你的创作者资料和成就
            </p>
          </div>
          <Switch
            checked={publicProfile}
            onChange={onPublicProfileToggle}
            disabled={disabled}
          />
        </div>

        <div className="h-px bg-white/[0.06]" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">通知提醒</p>
            <p className="text-xs text-white/40 mt-0.5">
              活动更新、奖励发放和成就解锁通知
            </p>
          </div>
          <Switch
            checked={notificationsEnabled}
            onChange={onNotificationsToggle}
            disabled={disabled}
            size="sm"
          />
        </div>

        <div className="h-px bg-white/[0.06]" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">自动领取奖励</p>
            <p className="text-xs text-white/40 mt-0.5">
              奖励达到阈值时自动领取到钱包
            </p>
          </div>
          <Switch
            checked={autoClaimRewards}
            onChange={onAutoClaimToggle}
            disabled={disabled}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
