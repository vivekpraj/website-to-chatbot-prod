"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";
import { Bot, Send, Loader, AlertCircle, Sparkles } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const { botId } = useParams<{ botId: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          setError("AI is temporarily unavailable. Please wait and try again.");
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
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-orange-900/20 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Header */}
      <header className="relative border-b border-white/10 bg-black/50 backdrop-blur-xl z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
                AI Assistant
              </h1>
              <p className="text-xs text-gray-500 font-mono">Bot ID: {botId}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="relative flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Welcome to CustomBot</h2>
              <p className="text-gray-400">Ask me anything about the website!</p>
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
                  msg.role === "user"
                    ? "bg-gradient-to-r from-purple-600 to-orange-600 text-white ml-12"
                    : "bg-white/5 border border-white/10 backdrop-blur-xl mr-12"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-medium text-purple-400">AI Assistant</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-2xl px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl mr-12">
                <div className="flex items-center gap-3">
                  <Loader className="w-5 h-5 text-purple-400 animate-spin" />
                  <span className="text-sm text-gray-400">AI is thinking...</span>
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
      <div className="relative border-t border-white/10 bg-black/50 backdrop-blur-xl">
        <form onSubmit={sendMessage} className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Ask a question..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-purple-600 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] flex items-center gap-2"
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