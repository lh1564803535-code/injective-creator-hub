"use client";

import { useCallback, useEffect, useState } from "react";

interface CampaignTextareaProps {
  description: string;
  onDescriptionChange: (value: string) => void;
  rules: string;
  onRulesChange: (value: string) => void;
  descriptionMaxLength?: number;
  rulesMaxLength?: number;
  disabled?: boolean;
}

function CharCounter({ current, max }: { current: number; max: number }) {
  const isAtLimit = current >= max;
  const isNearLimit = current > max * 0.9;
  return (
    <span
      className={`text-xs tabular-nums ${
        isAtLimit
          ? "text-red-400"
          : isNearLimit
            ? "text-amber-400"
            : "text-white/30"
      }`}
    >
      {current}/{max}
    </span>
  );
}

export function CampaignTextarea({
  description,
  onDescriptionChange,
  rules,
  onRulesChange,
  descriptionMaxLength = 500,
  rulesMaxLength = 1000,
  disabled = false,
}: CampaignTextareaProps) {
  const [descCount, setDescCount] = useState(description.length);
  const [rulesCount, setRulesCount] = useState(rules.length);

  useEffect(() => {
    setDescCount(description.length);
  }, [description]);

  useEffect(() => {
    setRulesCount(rules.length);
  }, [rules]);

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      let val = e.target.value;
      if (val.length > descriptionMaxLength) {
        val = val.slice(0, descriptionMaxLength);
      }
      setDescCount(val.length);
      onDescriptionChange(val);
    },
    [descriptionMaxLength, onDescriptionChange]
  );

  const handleRulesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      let val = e.target.value;
      if (val.length > rulesMaxLength) {
        val = val.slice(0, rulesMaxLength);
      }
      setRulesCount(val.length);
      onRulesChange(val);
    },
    [rulesMaxLength, onRulesChange]
  );

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 space-y-5">
      <h3 className="text-sm font-medium text-white/70">活动内容</h3>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          活动描述
        </label>
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          disabled={disabled}
          placeholder="描述你的活动目标、参与方式和亮点..."
          rows={4}
          className={`w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500/30 ${
            disabled ? "opacity-40 cursor-not-allowed" : ""
          }`}
        />
        <div className="mt-1 flex justify-end">
          <CharCounter current={descCount} max={descriptionMaxLength} />
        </div>
      </div>

      <div className="h-px bg-white/[0.06]" />

      {/* Rules */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          活动规则
        </label>
        <textarea
          value={rules}
          onChange={handleRulesChange}
          disabled={disabled}
          placeholder="列出参与规则、评选标准和注意事项..."
          rows={6}
          className={`w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500/30 ${
            disabled ? "opacity-40 cursor-not-allowed" : ""
          }`}
        />
        <div className="mt-1 flex justify-end">
          <CharCounter current={rulesCount} max={rulesMaxLength} />
        </div>
      </div>
    </div>
  );
}
