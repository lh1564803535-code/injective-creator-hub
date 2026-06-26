"use client";

import { useState, useCallback } from "react";
import { Mail, Building2, User } from "lucide-react";
import { Chat, type ChatMessage } from "@/components/ui/Chat";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CreatorChatProps {
  creatorName: string;
  creatorAddress?: string;
  projectName?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CreatorChat({
  creatorName,
  creatorAddress,
  projectName = "Project Team",
  className = "",
}: CreatorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "sys-1",
      role: "assistant",
      text: `This is a private conversation with ${projectName}. Your messages are end-to-end encrypted.`,
      sender: "System",
      timestamp: Date.now() - 60000,
    },
    {
      id: "msg-1",
      role: "assistant",
      text: `Hi ${creatorName}! Thanks for your interest in our campaign. Feel free to ask any questions about the project requirements or deliverables.`,
      sender: projectName,
      timestamp: Date.now() - 30000,
    },
  ]);

  const handleSend = useCallback(
    (text: string) => {
      const reply: ChatMessage = {
        id: `reply-${Date.now()}`,
        role: "assistant",
        text: "Got it! We'll get back to you shortly.",
        sender: projectName,
        timestamp: Date.now() + 1000,
      };
      setTimeout(() => {
        setMessages((prev) => [...prev, reply]);
      }, 1200);
    },
    [projectName],
  );

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1a1a1a] ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-semibold text-white">Private Message</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] text-emerald-400">Encrypted</span>
        </div>
      </div>

      {/* Participants */}
      <div className="flex items-center gap-3 border-b border-white/[0.04] px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20">
            <User className="h-3.5 w-3.5 text-cyan-300" />
          </div>
          <div>
            <p className="text-xs font-medium text-white">{creatorName}</p>
            {creatorAddress && (
              <p className="text-[10px] text-gray-600">{creatorAddress}</p>
            )}
          </div>
        </div>

        <span className="text-gray-600">&mdash;</span>

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20">
            <Building2 className="h-3.5 w-3.5 text-amber-300" />
          </div>
          <p className="text-xs font-medium text-white">{projectName}</p>
        </div>
      </div>

      {/* Chat area */}
      <Chat
        messages={messages}
        onSend={handleSend}
        placeholder="Type your message..."
        title=""
        height="h-[320px]"
        className="border-0 rounded-none"
      />
    </div>
  );
}
