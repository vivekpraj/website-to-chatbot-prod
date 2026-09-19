"use client";

import { useEffect, useState } from "react";
import { getToken, getUserRole } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/constants";
import Link from "next/link";
import { Bot, Users, MessageSquare, TrendingUp, Loader, ArrowLeft, Activity, CheckCircle, XCircle } from "lucide-react";

type Stats = {
  total_users: number;
  total_bots: number;
  total_messages: number;
};

type ServiceStatus = {
  status: "healthy" | "degraded";
  services: Record<string, string>;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [healthData, setHealthData] = useState<ServiceStatus | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);

  async function checkServices() {
    setHealthLoading(true);
    setHealthData(null);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/health`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = await res.json();
      // backend used to return a tuple serialized as [data, statusCode]
      const data = Array.isArray(raw) ? raw[0] : raw;
      if (data && typeof data.services === "object") {
        setHealthData(data);
      } else {
        setHealthData({ status: "degraded", services: { error: "FAIL: Unexpected response format" } });
      }
    } catch {
      setHealthData({ status: "degraded", services: { error: "FAIL: Could not reach backend" } });
    } finally {
      setHealthLoading(false);
    }
  }

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

        {/* Service Health Check */}
        <div className="mt-12 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold">Service Health</h2>
              {healthData && (
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  healthData.status === "healthy"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}>
                  {healthData.status}
                </span>
              )}
            </div>
            <button
              onClick={checkServices}
              disabled={healthLoading}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
            >
              {healthLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Activity className="w-4 h-4" />
              )}
              {healthLoading ? "Checking..." : "Check Services"}
            </button>
          </div>

          {!healthData && !healthLoading && (
            <p className="text-gray-500 text-sm">Click &quot;Check Services&quot; to run a live health check on all external services.</p>
          )}

          {healthData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(healthData.services).map(([name, status]) => {
                const ok = status === "ok";
                const label = name.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
                return (
                  <div
                    key={name}
                    className={`flex items-start gap-3 p-3 rounded-xl border ${
                      ok
                        ? "bg-green-500/10 border-green-500/20"
                        : "bg-red-500/10 border-red-500/20"
                    }`}
                  >
                    {ok ? (
                      <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <p className={`text-sm font-medium ${ok ? "text-green-300" : "text-red-300"}`}>{label}</p>
                      {!ok && (
                        <p className="text-xs text-red-400/80 mt-0.5 break-all">{status.replace("FAIL: ", "")}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}