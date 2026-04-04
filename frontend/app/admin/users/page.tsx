"use client";

import { useEffect, useState } from "react";
import { getToken, getUserRole } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/constants";
import { Users, Loader, Trash2, ArrowLeft, Bot } from "lucide-react";
import Link from "next/link";

type User = {
  id: number;
  email: string;
  name: string;
  role: string;
  bot_count: number;
  created_at: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const role = getUserRole();
    if (role !== "super_admin") {
      window.location.href = "/dashboard";
      return;
    }
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Failed to load users");
        return;
      }
      setUsers(data);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(userId: number) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = getToken();
      await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      alert("Failed to delete user");
    }
  }

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
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
              All Users
            </span>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Users</h1>
          <p className="text-gray-400">{users.length} registered users</p>
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

        {!loading && users.length === 0 && (
          <div className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No users found</p>
          </div>
        )}

        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-purple-500/20">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Bot className="w-4 h-4" />
                    <span>{user.bot_count} bot{user.bot_count !== 1 ? "s" : ""}</span>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    user.role === "super_admin"
                      ? "text-orange-400 bg-orange-500/10 border-orange-500/20"
                      : "text-purple-400 bg-purple-500/10 border-purple-500/20"
                  }`}>
                    {user.role}
                  </div>

                  {user.role !== "super_admin" && (
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}