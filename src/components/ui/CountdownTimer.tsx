"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  targetDate: number; // Unix timestamp
  onComplete?: () => void;
  className?: string;
}

export function CountdownTimer({ targetDate, onComplete, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = targetDate - now;

      if (diff <= 0) {
        setIsComplete(true);
        onComplete?.();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(diff / 86400),
        hours: Math.floor((diff % 86400) / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: diff % 60,
      };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  if (isComplete) {
    return (
      <div className={`flex items-center gap-2 text-emerald-400 ${className}`}>
        <Clock className="h-4 w-4" />
        <span className="text-sm font-medium">Completed</span>
      </div>
    );
  }

  const segments = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {segments.map((segment, index) => (
        <div key={segment.label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <span className="font-mono text-lg font-bold text-white">
              {String(segment.value).padStart(2, "0")}
            </span>
            <span className="text-[10px] text-gray-500">{segment.label}</span>
          </div>
          {index < segments.length - 1 && (
            <span className="text-gray-600">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
