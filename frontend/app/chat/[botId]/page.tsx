"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";
import { Bot, Send, Loader, AlertCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

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
                <div className="max-w-4xl mx-auto px-6 py-4">
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
              <p className="text-xs opacity-50 font-mono">Powered by CustomBot</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="relative flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
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
                className={`max-w-2xl px-6 py-4 rounded-2xl ${
                  msg.role === "user" ? "ml-12" : "mr-12"
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
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-2xl px-6 py-4 rounded-2xl mr-12" style={{ backgroundColor: botConfig.primary_color + "15", border: `1px solid ${botConfig.primary_color}33` }}>
                <div className="flex items-center gap-3">
                  <Loader className="w-5 h-5 animate-spin" style={{ color: botConfig.primary_color }} />
                  <span className="text-sm" style={{ color: botConfig.text_color }}>AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="max-w-2xl px-6 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl">
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
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Ask a question..."
               className="flex-1 rounded-xl px-6 py-4 focus:outline-none transition border"
              style={{ backgroundColor: botConfig.background_color, color: botConfig.text_color, borderColor: botConfig.primary_color + "66" }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
                        <button
              type="submit"
              disabled={loading || !input.trim()}
              className="text-white px-8 py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] flex items-center gap-2"
              style={{ backgroundColor: botConfig.primary_color }}
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}