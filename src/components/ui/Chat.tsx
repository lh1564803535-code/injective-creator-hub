"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, MessageCircle } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  sender?: string;
  timestamp: number;
}

interface ChatProps {
  messages?: ChatMessage[];
  placeholder?: string;
  onSend?: (text: string) => void;
  className?: string;
  title?: string;
  height?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Chat({
  messages: initialMessages = [],
  placeholder = "Type a message...",
  onSend,
  className = "",
  title = "Chat",
  height = "h-[400px]",
}: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        text: trimmed,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      onSend?.(trimmed);
    },
    [onSend],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1a1a1a] ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
        <MessageCircle className="h-4 w-4 text-cyan-400" />
        <span className="text-sm font-semibold text-white">{title}</span>
      </div>

      {/* Messages */}
      <div ref={listRef} className={`flex-1 space-y-3 overflow-y-auto px-4 py-4 ${height}`}>
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-gray-500">No messages yet</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className="max-w-[80%]">
              {msg.sender && msg.role === "assistant" && (
                <p className="mb-1 text-[10px] font-medium text-gray-500">{msg.sender}</p>
              )}
              <div
                className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === "user"
                    ? "rounded-br-md bg-cyan-600 text-white"
                    : "rounded-bl-md bg-white/[0.06] text-gray-200"
                }`}
              >
                {msg.text}
              </div>
              <p
                className={`mt-1 text-[10px] text-gray-600 ${
                  msg.role === "user" ? "text-right" : ""
                }`}
              >
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2 focus-within:ring-1 focus-within:ring-cyan-500/30">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600 text-white transition hover:bg-cyan-500 disabled:opacity-30 disabled:hover:bg-cyan-600"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
