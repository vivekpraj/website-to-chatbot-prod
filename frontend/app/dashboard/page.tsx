"use client";

import { useState, useEffect } from "react";
import { getToken, getUserRole, logout } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/constants";
import Link from "next/link";
import { Bot, Plus, Globe, ExternalLink, Loader, CheckCircle, Clock, AlertCircle, LogOut, Users, LayoutDashboard } from "lucide-react";

type Bot = {
  bot_id: string;
  website_url: string;
  status: string;
  created_at: string;
};

export default function DashboardPage() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [bots, setBots] = useState<Bot[]>([]);
  const [loadingBots, setLoadingBots] = useState(true);

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }

    setRole(getUserRole());

    async function fetchBots() {
      try {
        const res = await fetch(`${API_BASE_URL}/bots/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setBots(data);
        }
      } catch {
        console.error("Failed to fetch bots");
      } finally {
        setLoadingBots(false);
      }
    }

    fetchBots();
  }, []);

  async function handleCreateBot(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const token = getToken();

      const res = await fetch(`${API_BASE_URL}/bots/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ website_url: websiteUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Failed to create bot");
        return;
      }

      setMessage("Bot created successfully!");
      setWebsiteUrl("");

      setBots((prev) => [data, ...prev]);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
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
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-orange-900/20 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Header */}
      <header className="relative border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
              CustomBot
            </span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400 flex items-center gap-2">
            Logged in as <span className="text-purple-400 font-medium">{role}</span>
          </p>
        </div>

        {/* Create Bot Section - Only for clients */}
        {role === "client" && (
          <div className="mb-12">
            <div className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                  <Plus className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold">Create New Bot</h2>
              </div>

              {message && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl mb-4 backdrop-blur-sm">
                  {message}
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 backdrop-blur-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateBot} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Enter the website you want to create a chatbot for
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-orange-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Creating Bot...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Create Bot
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Bots List */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-purple-400" />
            Your Bots
          </h2>

          {loadingBots && (
            <div className="text-center py-12">
              <Loader className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
              <p className="text-gray-400">Loading bots...</p>
            </div>
          )}

          {!loadingBots && bots.length === 0 && (
            <div className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
              <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-400">No bots yet</h3>
              <p className="text-gray-500">Create your first bot to get started!</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {bots.map((bot) => {
              const chatUrl = `${window.location.origin}/chat/${bot.bot_id}`;

              return (
                <div
                  key={bot.bot_id}
                  className="group bg-gradient-to-br from-purple-900/20 to-orange-900/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-purple-500/20">
                        <Bot className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Website Bot</h3>
                        <p className="text-xs text-gray-500">{new Date(bot.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(bot.status)}`}>
                      {getStatusIcon(bot.status)}
                      {bot.status}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Website</p>
                      <p className="text-sm text-gray-300 truncate">{bot.website_url}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Chat URL</p>
                      <a
                        href={chatUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 group/link"
                      >
                        <span className="truncate">{chatUrl}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Admin Controls */}
        {role === "super_admin" && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-orange-400" />
              Admin Controls
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/admin/users"
                className="group bg-gradient-to-br from-purple-900/20 to-purple-600/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/50 transition-all hover:scale-[1.02]"
              >
                <Users className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="text-xl font-bold mb-2">View All Users</h3>
                <p className="text-sm text-gray-400">Manage user accounts and permissions</p>
              </Link>

              <Link
                href="/admin/bots"
                className="group bg-gradient-to-br from-orange-900/20 to-orange-600/10 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6 hover:border-orange-500/50 transition-all hover:scale-[1.02]"
              >
                <Bot className="w-8 h-8 text-orange-400 mb-3" />
                <h3 className="text-xl font-bold mb-2">View All Bots</h3>
                <p className="text-sm text-gray-400">Monitor all chatbots in the system</p>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}