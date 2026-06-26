"use client";

import { useState, useCallback } from "react";
import { MessageSquare, Users } from "lucide-react";
import { Chat, type ChatMessage } from "@/components/ui/Chat";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Participant {
  address: string;
  name: string;
  avatar?: string;
}

interface CampaignChatProps {
  campaignId: number;
  campaignTitle: string;
  participants?: Participant[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Mock participants
// ---------------------------------------------------------------------------

const MOCK_PARTICIPANTS: Participant[] = [
  { address: "0x1234...abcd", name: "Alice" },
  { address: "0x5678...efgh", name: "Bob" },
  { address: "0x9abc...ijkl", name: "Charlie" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CampaignChat({
  campaignId,
  campaignTitle,
  participants = MOCK_PARTICIPANTS,
  className = "",
}: CampaignChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "sys-1",
      role: "assistant",
      text: `Welcome to the discussion for "${campaignTitle}"! Share ideas, ask questions, and collaborate with other participants.`,
      sender: "System",
      timestamp: Date.now() - 60000,
    },
    {
      id: "msg-1",
      role: "assistant",
      text: "Hey everyone! Excited to be part of this campaign. Anyone have tips for creating engaging content?",
      sender: "Alice",
      timestamp: Date.now() - 30000,
    },
  ]);

  const handleSend = useCallback(
    (text: string) => {
      const reply: ChatMessage = {
        id: `reply-${Date.now()}`,
        role: "assistant",
        text: "Thanks for sharing! The community will see your message shortly.",
        sender: "System",
        timestamp: Date.now() + 1000,
      };
      // Simulate a reply after a short delay
      setTimeout(() => {
        setMessages((prev) => [...prev, reply]);
      }, 800);
    },
    [],
  );

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1a1a1a] ${className}`}
    >
      {/* Campaign info header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-semibold text-white">Campaign Discussion</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-gray-500" />
          <span className="text-[10px] text-gray-500">{participants.length} participants</span>
        </div>
      </div>

      {/* Participant avatars */}
      <div className="flex items-center gap-2 border-b border-white/[0.04] px-4 py-2">
        {participants.map((p) => (
          <div
            key={p.address}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-[10px] font-medium text-cyan-300"
            title={p.name}
          >
            {p.name.charAt(0)}
          </div>
        ))}
        <span className="ml-1 text-[10px] text-gray-600">
          {participants.map((p) => p.name).join(", ")}
        </span>
      </div>

      {/* Chat area */}
      <Chat
        messages={messages}
        onSend={handleSend}
        placeholder="Discuss this campaign..."
        title=""
        height="h-[320px]"
        className="border-0 rounded-none"
      />
    </div>
  );
}
