"use client";

import { useEffect, useState } from "react";
import { getToken, getUserRole } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/constants";
import Link from "next/link";
import { Bot, Users, MessageSquare, TrendingUp, Loader, ArrowLeft } from "lucide-react";

type Stats = {
  total_users: number;
  total_bots: number;
  total_messages: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const role = getUserRole();
    if (role !== "super_admin") {
      window.location.href = "/dashboard";
      return;
    }
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Failed to load stats");
        return;
      }
      setStats(data);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-orange-900/20 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Header */}
      <header className="relative border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
              Admin Dashboard
            </span>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Overview</h1>
          <p className="text-gray-400">Platform-wide statistics and controls</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-32">
            <Loader className="w-8 h-8 animate-spin text-purple-400" />
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Stat Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
              <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <p className="text-4xl font-bold">{stats.total_users}</p>
              <p className="text-gray-400 mt-2">Total Users</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
              <Bot className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <p className="text-4xl font-bold">{stats.total_bots}</p>
              <p className="text-gray-400 mt-2">Total Bots</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
              <MessageSquare className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <p className="text-4xl font-bold">{stats.total_messages}</p>
              <p className="text-gray-400 mt-2">Total Messages</p>
            </div>
          </div>
        )}

        {/* Nav Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/users">
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-600/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/50 transition-all hover:scale-[1.02] cursor-pointer">
              <Users className="w-8 h-8 text-purple-400 mb-3" />
              <h2 className="text-xl font-bold mb-2">Users</h2>
              <p className="text-sm text-gray-400">View and manage all registered users</p>
            </div>
          </Link>

          <Link href="/admin/bots">
            <div className="bg-gradient-to-br from-orange-900/20 to-orange-600/10 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6 hover:border-orange-500/50 transition-all hover:scale-[1.02] cursor-pointer">
              <Bot className="w-8 h-8 text-orange-400 mb-3" />
              <h2 className="text-xl font-bold mb-2">Bots</h2>
              <p className="text-sm text-gray-400">View and manage all created bots</p>
            </div>
          </Link>

          <Link href="/admin/analytics">
            <div className="bg-gradient-to-br from-green-900/20 to-green-600/10 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 hover:border-green-500/50 transition-all hover:scale-[1.02] cursor-pointer">
              <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
              <h2 className="text-xl font-bold mb-2">Analytics</h2>
              <p className="text-sm text-gray-400">View platform usage and trends</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}