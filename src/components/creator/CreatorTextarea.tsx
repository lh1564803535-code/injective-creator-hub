"use client";

import { useCallback, useEffect, useState } from "react";

interface CreatorTextareaProps {
  bio: string;
  onBioChange: (value: string) => void;
  workDescription: string;
  onWorkDescriptionChange: (value: string) => void;
  bioMaxLength?: number;
  workDescriptionMaxLength?: number;
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

export function CreatorTextarea({
  bio,
  onBioChange,
  workDescription,
  onWorkDescriptionChange,
  bioMaxLength = 300,
  workDescriptionMaxLength = 1000,
  disabled = false,
}: CreatorTextareaProps) {
  const [bioCount, setBioCount] = useState(bio.length);
  const [workCount, setWorkCount] = useState(workDescription.length);

  useEffect(() => {
    setBioCount(bio.length);
  }, [bio]);

  useEffect(() => {
    setWorkCount(workDescription.length);
  }, [workDescription]);

  const handleBioChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      let val = e.target.value;
      if (val.length > bioMaxLength) {
        val = val.slice(0, bioMaxLength);
      }
      setBioCount(val.length);
      onBioChange(val);
    },
    [bioMaxLength, onBioChange]
  );

  const handleWorkChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      let val = e.target.value;
      if (val.length > workDescriptionMaxLength) {
        val = val.slice(0, workDescriptionMaxLength);
      }
      setWorkCount(val.length);
      onWorkDescriptionChange(val);
    },
    [workDescriptionMaxLength, onWorkDescriptionChange]
  );

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5 space-y-5">
      <h3 className="text-sm font-medium text-white/70">创作者信息</h3>

      {/* Bio */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          个人简介
        </label>
        <textarea
          value={bio}
          onChange={handleBioChange}
          disabled={disabled}
          placeholder="介绍一下你自己，你的专业领域和创作方向..."
          rows={3}
          className={`w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500/30 ${
            disabled ? "opacity-40 cursor-not-allowed" : ""
          }`}
        />
        <div className="mt-1 flex justify-end">
          <CharCounter current={bioCount} max={bioMaxLength} />
        </div>
      </div>

      <div className="h-px bg-white/[0.06]" />

      {/* Work Description */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">
          作品描述
        </label>
        <textarea
          value={workDescription}
          onChange={handleWorkChange}
          disabled={disabled}
          placeholder="描述你的代表作品、创作经历和擅长领域..."
          rows={6}
          className={`w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-500/30 ${
            disabled ? "opacity-40 cursor-not-allowed" : ""
          }`}
        />
        <div className="mt-1 flex justify-end">
          <CharCounter current={workCount} max={workDescriptionMaxLength} />
        </div>
      </div>
    </div>
  );
}
