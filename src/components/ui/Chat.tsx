"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, MessageCircle } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChatMessage {
  id: string;
  role: "user" | "other";
  text: string;
  sender?: string;
  avatar?: string;
  timestamp: number;
}

interface ChatProps {
  /** Initial messages to display */
  messages?: ChatMessage[];
  /** Placeholder text for the input */
  placeholder?: string;
  /** Callback when a message is sent */
  onSend?: (text: string) => void;
  /** Whether to show the empty-state illustration */
  showEmpty?: boolean;
  /** Additional class names */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function makeId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Chat({
  messages: initialMessages = [],
  placeholder = "Type a message...",
  onSend,
  showEmpty = true,
  className = "",
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

      const msg: ChatMessage = {
        id: makeId(),
        role: "user",
        text: trimmed,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, msg]);
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

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1a1a1a] ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
        <MessageCircle className="h-4 w-4 text-cyan-400" />
        <span className="text-sm font-semibold text-white">Chat</span>
        <span className="ml-auto text-[10px] text-gray-500">
          {messages.length} message{messages.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" style={{ minHeight: 200 }}>
        {messages.length === 0 && showEmpty ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageCircle className="mb-2 h-8 w-8 text-gray-600" />
            <p className="text-sm text-gray-500">No messages yet</p>
            <p className="text-xs text-gray-600">Start the conversation</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role !== "user" && msg.avatar && (
                <img
                  src={msg.avatar}
                  alt={msg.sender ?? "avatar"}
                  className="mr-2 h-7 w-7 shrink-0 rounded-full object-cover"
                />
              )}
              <div className="max-w-[75%]">
                {msg.role !== "user" && msg.sender && (
                  <p className="mb-0.5 text-[10px] font-medium text-gray-500">{msg.sender}</p>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "rounded-br-md bg-cyan-600 text-white"
                      : "rounded-bl-md bg-white/[0.06] text-gray-200"
                  }`}
                >
                  {msg.text}
                </div>
                <p
                  className={`mt-0.5 text-[10px] text-gray-600 ${
                    msg.role === "user" ? "text-right" : ""
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
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
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600 text-white transition hover:bg-cyan-500 disabled:opacity-30"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
