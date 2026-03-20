"use client";

import { useEffect, useState } from "react";
import { getToken, getUserRole } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/constants";
import Link from "next/link";

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

      {loading && <p>Loading stats...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {stats && (
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="border rounded p-6 bg-gray-50 text-center">
            <p className="text-4xl font-bold">{stats.total_users}</p>
            <p className="text-gray-500 mt-2">Total Users</p>
          </div>
          <div className="border rounded p-6 bg-gray-50 text-center">
            <p className="text-4xl font-bold">{stats.total_bots}</p>
            <p className="text-gray-500 mt-2">Total Bots</p>
          </div>
          <div className="border rounded p-6 bg-gray-50 text-center">
            <p className="text-4xl font-bold">{stats.total_messages}</p>
            <p className="text-gray-500 mt-2">Total Messages</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <Link href="/admin/users">
          <div className="border rounded p-6 bg-white hover:bg-gray-50 cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Users</h2>
            <p className="text-gray-500">View and manage all registered users</p>
          </div>
        </Link>

        <Link href="/admin/bots">
          <div className="border rounded p-6 bg-white hover:bg-gray-50 cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Bots</h2>
            <p className="text-gray-500">View and manage all created bots</p>
          </div>
        </Link>
      </div>
    </div>
  );
}