"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";
import { Bot, Send, Loader, AlertCircle, Sparkles } from "lucide-react";
import Image from "next/image";

function MarkdownText({ text, color }: { text: string; color: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  function flushList() {
    if (listItems.length === 0) return;
    elements.push(
      <ul key={elements.length} className="list-disc list-inside space-y-1 my-1">
        {listItems.map((item, i) => (
          <li key={i}>{renderInline(item)}</li>
        ))}
      </ul>
    );
    listItems = [];
  }

  function renderInline(str: string): React.ReactNode {
    const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**"))
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      if (part.startsWith("*") && part.endsWith("*"))
        return <em key={i}>{part.slice(1, -1)}</em>;
      if (part.startsWith("`") && part.endsWith("`"))
        return <code key={i} className="px-1 rounded text-xs font-mono" style={{ backgroundColor: color + "22" }}>{part.slice(1, -1)}</code>;
      return part;
    });
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const bulletMatch = line.match(/^[-*]\s+(.*)/);
    const numberedMatch = line.match(/^\d+\.\s+(.*)/);

    if (bulletMatch || numberedMatch) {
      listItems.push((bulletMatch || numberedMatch)![1]);
    } else {
      flushList();
      if (line.startsWith("### ")) {
        elements.push(<p key={i} className="font-bold text-sm mt-2">{renderInline(line.slice(4))}</p>);
      } else if (line.startsWith("## ")) {
        elements.push(<p key={i} className="font-bold">{renderInline(line.slice(3))}</p>);
      } else if (line.trim() === "") {
        elements.push(<div key={i} className="h-2" />);
      } else {
        elements.push(<p key={i}>{renderInline(line)}</p>);
      }
    }
  }
  flushList();

  return <div className="space-y-0.5 text-sm leading-relaxed">{elements}</div>;
}

type Message = {
  role: "user" | "assistant";
  content: string;
};

type BotConfig = {
  bot_name: string | null;
  greeting_message: string | null;
  primary_color: string;
  background_color: string;
  text_color: string;
  logo_url: string | null;
  show_branding: boolean;
};

export default function ChatPage() {
  const { botId } = useParams<{ botId: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [botConfig, setBotConfig] = useState<BotConfig>({
    bot_name: null,
    greeting_message: null,
    primary_color: "#2563eb",
    background_color: "#ffffff",
    text_color: "#111827",
    logo_url: null,
    show_branding: true,
  });

  useEffect(() => {
    async function fetchBotConfig() {
      try {
        const res = await fetch(`${API_BASE_URL}/bots/${botId}/public`);
        if (res.ok) {
          const data = await res.json();
          setBotConfig(data);
        }
      } catch {
        console.error("Failed to fetch bot config");
      }
    }
    fetchBotConfig();
  }, [botId]);


  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/${botId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          // Check if it's question limit or API quota
          if (data.detail && data.detail.includes("question limit")) {
            setError(data.detail);
          } else {
            setError("AI is temporarily unavailable. Please wait and try again.");
          }
        } else {
          setError(data.detail || "Chat failed");
        }
        return;
      }

      const botMessage: Message = {
        role: "assistant",
        content: data.answer,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: botConfig.background_color, color: botConfig.text_color }}>

      {/* Header */}
      <header className="relative border-b backdrop-blur-xl z-10" style={{ borderColor: botConfig.primary_color + "33", backgroundColor: botConfig.background_color }}>
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            {botConfig.logo_url ? (
              <Image
                src={botConfig.logo_url}
                alt="Bot Logo"
                width={40}
                height={40}
                className="w-10 h-10 rounded-xl object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: botConfig.primary_color }}>
                <Bot className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold">
                {botConfig.bot_name || "AI Assistant"}
              </h1>
              {botConfig.show_branding && (
                <p className="text-xs opacity-50 font-mono">Powered by CustomBot</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="relative flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
                    {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: botConfig.primary_color + "33", border: `1px solid ${botConfig.primary_color}55` }}>
                <Sparkles className="w-8 h-8" style={{ color: botConfig.primary_color }} />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ color: botConfig.text_color }}>
                {botConfig.bot_name ? `Welcome to ${botConfig.bot_name}` : "Welcome to CustomBot"}
              </h2>
              <p style={{ color: botConfig.text_color, opacity: 0.7 }}>
                {botConfig.greeting_message || "Ask me anything about the website!"}
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-2xl px-4 py-3 rounded-2xl ${
                  msg.role === "user" ? "ml-6 sm:ml-12" : "mr-6 sm:mr-12"
                }`}
                style={
                  msg.role === "user"
                    ? { backgroundColor: botConfig.primary_color, color: "#ffffff" }
                    : { backgroundColor: botConfig.primary_color + "15", border: `1px solid ${botConfig.primary_color}33`, color: botConfig.text_color }
                }
              >
                {msg.role === "assistant" && (
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4" style={{ color: botConfig.primary_color }} />
                  <span className="text-xs font-medium" style={{ color: botConfig.primary_color }}>
                    {botConfig.bot_name || "AI Assistant"}
                  </span>
                </div>
              )}
                <MarkdownText text={msg.content} color={botConfig.primary_color} />
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-2xl px-4 py-3 rounded-2xl mr-6 sm:mr-12" style={{ backgroundColor: botConfig.primary_color + "15", border: `1px solid ${botConfig.primary_color}33` }}>
                <div className="flex items-center gap-3">
                  <Loader className="w-5 h-5 animate-spin" style={{ color: botConfig.primary_color }} />
                  <span className="text-sm" style={{ color: botConfig.text_color }}>AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="max-w-2xl px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-sm text-red-400">{error}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="relative border-t" style={{ borderColor: botConfig.primary_color + "33", backgroundColor: botConfig.background_color }}>
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask a question..."
              className="flex-1 min-w-0 rounded-xl px-4 py-3 focus:outline-none transition border text-sm"
              style={{ backgroundColor: botConfig.background_color, color: botConfig.text_color, borderColor: botConfig.primary_color + "66" }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="text-white px-4 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] flex items-center gap-1.5 flex-shrink-0"
              style={{ backgroundColor: botConfig.primary_color }}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}