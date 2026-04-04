"use client";

import { useEffect, useState } from "react";
import { getToken, getUserRole } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/constants";
import { Bot, Loader, Trash2, ArrowLeft, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

type BotType = {
  bot_id: string;
  website_url: string;
  status: string;
  message_count: number;
  owner_email: string;
  created_at: string;
};

export default function AdminBotsPage() {
  const [bots, setBots] = useState<BotType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = getUserRole();
    if (role !== "super_admin") {
      window.location.href = "/dashboard";
      return;
    }
    fetchBots();
  }, []);

  async function fetchBots() {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/admin/bots`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setBots(data);
    } finally {
      setLoading(false);
    }
  }

  async function deleteBot(botId: string) {
    if (!confirm("Delete this bot?")) return;
    try {
      const token = getToken();
      await fetch(`${API_BASE_URL}/admin/bots/${botId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setBots((prev) => prev.filter((b) => b.bot_id !== botId));
    } catch {
      alert("Failed to delete bot");
    }
  }

  const getStatusIcon = (status: string) => {
    if (status === "ready") return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (status === "processing") return <Clock className="w-4 h-4 text-yellow-400" />;
    return <AlertCircle className="w-4 h-4 text-red-400" />;
  };

  const getStatusColor = (status: string) => {
    if (status === "ready") return "text-green-400 bg-green-500/10 border-green-500/20";
    if (status === "processing") return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    return "text-red-400 bg-red-500/10 border-red-500/20";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-orange-900/20 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      <header className="relative border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/admin" className="text-gray-400 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
              All Bots
            </span>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Bots</h1>
          <p className="text-gray-400">{bots.length} total bots in the system</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-32">
            <Loader className="w-8 h-8 animate-spin text-purple-400" />
          </div>
        )}

        {!loading && bots.length === 0 && (
          <div className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
            <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No bots found</p>
          </div>
        )}

        <div className="space-y-4">
          {bots.map((bot) => (
            <div
              key={bot.bot_id}
              className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-purple-500/20">
                    <Bot className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white truncate max-w-md">{bot.website_url}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{bot.owner_email}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Created {new Date(bot.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-400">{bot.message_count}</p>
                    <p className="text-xs text-gray-500">messages</p>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(bot.status)}`}>
                    {getStatusIcon(bot.status)}
                    {bot.status}
                  </div>
                  <button
                    onClick={() => deleteBot(bot.bot_id)}
                    className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}