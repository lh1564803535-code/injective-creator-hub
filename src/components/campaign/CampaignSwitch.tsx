"use client";

import { Switch } from "@/components/ui/Switch";

interface CampaignSwitchProps {
  campaignEnabled: boolean;
  onCampaignToggle: (enabled: boolean) => void;
  votingEnabled: boolean;
  onVotingToggle: (enabled: boolean) => void;
  notificationsEnabled: boolean;
  onNotificationsToggle: (enabled: boolean) => void;
  disabled?: boolean;
}

export function CampaignSwitch({
  campaignEnabled,
  onCampaignToggle,
  votingEnabled,
  onVotingToggle,
  notificationsEnabled,
  onNotificationsToggle,
  disabled = false,
}: CampaignSwitchProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 space-y-4">
      <h3 className="text-sm font-medium text-white/70">活动设置</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">启用活动</p>
            <p className="text-xs text-white/40 mt-0.5">
              关闭后活动将暂停，参与者无法提交内容
            </p>
          </div>
          <Switch
            checked={campaignEnabled}
            onChange={onCampaignToggle}
            disabled={disabled}
          />
        </div>

        <div className="h-px bg-white/[0.06]" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">投票开关</p>
            <p className="text-xs text-white/40 mt-0.5">
              允许社区对提交内容进行投票
            </p>
          </div>
          <Switch
            checked={votingEnabled}
            onChange={onVotingToggle}
            disabled={disabled || !campaignEnabled}
            size="sm"
          />
        </div>

        <div className="h-px bg-white/[0.06]" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">通知提醒</p>
            <p className="text-xs text-white/40 mt-0.5">
              新提交和投票结果将发送通知
            </p>
          </div>
          <Switch
            checked={notificationsEnabled}
            onChange={onNotificationsToggle}
            disabled={disabled}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
