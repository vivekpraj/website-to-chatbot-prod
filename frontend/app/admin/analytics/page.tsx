"use client";

import { useEffect, useState } from "react";
import { getToken, getUserRole } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/constants";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  Bot, Users, MessageSquare, Clock, Zap,
  TrendingUp, Loader, ArrowLeft
} from "lucide-react";
import Link from "next/link";

type AnalyticsData = {
  messages_per_day: { date: string; count: number }[];
  users_per_day: { date: string; count: number }[];
  bots_per_day: { date: string; count: number }[];
  unique_sessions_per_day: { date: string; count: number }[];
  top_bots: {
    bot_id: string;
    website_url: string;
    message_count: number;
    owner_email: string;
    last_used_at: string | null;
  }[];
  avg_response_time_ms: number;
};

const DAYS_OPTIONS = [7, 30, 90];

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const role = getUserRole();
    if (role !== "super_admin") {
      window.location.href = "/dashboard";
      return;
    }
    fetchAnalytics();
  }, [days]);

  async function fetchAnalytics() {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/admin/analytics?days=${days}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok) setData(json);
    } finally {
      setLoading(false);
    }
  }

  // Merge all time series by date
  function getMergedChartData() {
    if (!data) return [];
    const dateMap: Record<string, any> = {};

    data.messages_per_day.forEach(({ date, count }) => {
      if (!dateMap[date]) dateMap[date] = { date };
      dateMap[date].messages = count;
    });
    data.users_per_day.forEach(({ date, count }) => {
      if (!dateMap[date]) dateMap[date] = { date };
      dateMap[date].users = count;
    });
    data.bots_per_day.forEach(({ date, count }) => {
      if (!dateMap[date]) dateMap[date] = { date };
      dateMap[date].bots = count;
    });
    data.unique_sessions_per_day.forEach(({ date, count }) => {
      if (!dateMap[date]) dateMap[date] = { date };
      dateMap[date].sessions = count;
    });

    return Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
  }

  const chartData = getMergedChartData();

  const totalMessages = data?.messages_per_day.reduce((s, d) => s + d.count, 0) || 0;
  const totalNewUsers = data?.users_per_day.reduce((s, d) => s + d.count, 0) || 0;
  const totalNewBots = data?.bots_per_day.reduce((s, d) => s + d.count, 0) || 0;
  const totalSessions = data?.unique_sessions_per_day.reduce((s, d) => s + d.count, 0) || 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-orange-900/20 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Header */}
      <header className="relative border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
                Analytics
              </span>
            </div>
          </div>

          {/* Days filter */}
          <div className="flex gap-2">
            {DAYS_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  days === d
                    ? "bg-gradient-to-r from-purple-600 to-orange-600 text-white"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader className="w-8 h-8 animate-spin text-purple-400" />
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {[
                { label: "Messages", value: totalMessages, icon: <MessageSquare className="w-5 h-5 text-purple-400" />, color: "purple" },
                { label: "New Users", value: totalNewUsers, icon: <Users className="w-5 h-5 text-orange-400" />, color: "orange" },
                { label: "New Bots", value: totalNewBots, icon: <Bot className="w-5 h-5 text-green-400" />, color: "green" },
                { label: "Unique Sessions", value: totalSessions, icon: <Zap className="w-5 h-5 text-yellow-400" />, color: "yellow" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    {stat.icon}
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                  <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Last {days} days</p>
                </div>
              ))}
            </div>

            {/* Avg Response Time */}
            <div className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-10 flex items-center gap-4">
              <Clock className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Avg Response Time</p>
                <p className="text-2xl font-bold">{data?.avg_response_time_ms ?? 0} ms</p>
              </div>
            </div>

            {/* Line Chart */}
            <div className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-10">
              <h2 className="text-xl font-bold mb-6">Activity Over Time</h2>
              {chartData.length === 0 ? (
                <p className="text-gray-500 text-center py-12">No data for this period</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis
                      dataKey="date"
                      stroke="#6b7280"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => v.slice(5)}
                    />
                    <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0a0a0a",
                        border: "1px solid #ffffff20",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="messages" stroke="#a855f7" strokeWidth={2} dot={false} name="Messages" />
                    <Line type="monotone" dataKey="sessions" stroke="#f97316" strokeWidth={2} dot={false} name="Sessions" />
                    <Line type="monotone" dataKey="users" stroke="#22c55e" strokeWidth={2} dot={false} name="New Users" />
                    <Line type="monotone" dataKey="bots" stroke="#eab308" strokeWidth={2} dot={false} name="New Bots" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Top Bots */}
            <div className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Top Bots by Messages</h2>
              {data?.top_bots.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No bots yet</p>
              ) : (
                <div className="space-y-4">
                  {data?.top_bots.map((bot, i) => (
                    <div
                      key={bot.bot_id}
                      className="flex items-center justify-between border border-white/10 rounded-xl p-4 hover:border-purple-500/30 transition"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-gray-600">#{i + 1}</span>
                        <div>
                          <p className="text-sm font-medium text-white truncate max-w-xs">{bot.website_url}</p>
                          <p className="text-xs text-gray-500">{bot.owner_email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-purple-400">{bot.message_count}</p>
                        <p className="text-xs text-gray-500">messages</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}