"use client";

import { useEffect, useState } from "react";
import { getToken, getUserRole } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/constants";
import { Users, Loader, Trash2, ArrowLeft, Bot, Pencil, Check, X } from "lucide-react";
import Link from "next/link";

type User = {
  id: number;
  email: string;
  name: string;
  role: string;
  bot_count: number;
  bot_limit: number;
  created_at: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Inline edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editBotLimit, setEditBotLimit] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (getUserRole() !== "super_admin") { window.location.href = "/dashboard"; return; }
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Failed to load users"); return; }
      setUsers(data);
    } catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  }

  function startEdit(user: User) {
    setEditingId(user.id);
    setEditName(user.name);
    setEditBotLimit(user.bot_limit);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(userId: number) {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ name: editName, bot_limit: editBotLimit }),
      });
      if (!res.ok) { alert("Failed to save changes"); return; }
      setEditingId(null);
      await fetchUsers();
    } catch { alert("Something went wrong"); }
    finally { setSaving(false); }
  }

  async function deleteUser(userId: number) {
    if (!confirm("Delete this user and all their bots?")) return;
    try {
      await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch { alert("Failed to delete user"); }
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

        <div className="space-y-4">
          {users.map((user) => {
            const isEditing = editingId === user.id;
            return (
              <div
                key={user.id}
                className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition"
              >
                {isEditing ? (
                  /* ── Edit mode ── */
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Name</label>
                        <input
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Bot Limit</label>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={editBotLimit}
                          onChange={e => setEditBotLimit(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(user.id)}
                        disabled={saving}
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-xl transition disabled:opacity-50"
                      >
                        {saving ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 text-sm rounded-xl hover:bg-white/10 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── View mode ── */
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-purple-500/20 flex-shrink-0">
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

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1.5 text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                        <Bot className="w-3.5 h-3.5" />
                        <span>{user.bot_count}/{user.bot_limit} bots</span>
                      </div>

                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        user.role === "super_admin"
                          ? "text-orange-400 bg-orange-500/10 border-orange-500/20"
                          : "text-purple-400 bg-purple-500/10 border-purple-500/20"
                      }`}>
                        {user.role}
                      </div>

                      <button
                        onClick={() => startEdit(user)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-purple-400 bg-white/5 hover:bg-purple-500/10 border border-white/10 rounded-lg transition"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>

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
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
