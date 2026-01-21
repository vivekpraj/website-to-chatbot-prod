"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveToken, getToken, removeToken } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/constants";
import { Bot, Sparkles, Globe, CheckCircle, ArrowRight, LogOut } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Bot creation states
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [creating, setCreating] = useState(false);
  const [botId, setBotId] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(getToken()));
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Login failed");
        return;
      }

      saveToken(data.access_token);
      setIsLoggedIn(true);
      setEmail("");
      setPassword("");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateBot(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/bots/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ website_url: websiteUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Failed to create bot");
        return;
      }

      setBotId(data.bot_id);
      setWebsiteUrl("");
    } catch {
      setError("Failed to create bot");
    } finally {
      setCreating(false);
    }
  }

  function handleLogout() {
    removeToken();
    setIsLoggedIn(false);
    setBotId(null);
    setWebsiteUrl("");
    setError("");
  }

  function goToDashboard() {
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden relative">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-orange-900/20 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="relative w-full max-w-md mx-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
            CustomBot
          </span>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          {!isLoggedIn ? (
            <>
              <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back</h1>
              <p className="text-gray-400 text-center mb-8">Sign in to manage your bots</p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-orange-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-400 mt-6">
                Don't have an account?{" "}
                <a href="/register" className="text-purple-400 hover:text-purple-300 font-medium transition">
                  Create one
                </a>
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Create New Bot</h1>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white transition flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
                  {error}
                </div>
              )}

              {!botId ? (
                <>
                  <form onSubmit={handleCreateBot} className="space-y-5 mb-4">
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
                      disabled={creating}
                      className="w-full bg-gradient-to-r from-purple-600 to-orange-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
                    >
                      {creating ? "Creating Bot..." : "Create Bot"}
                    </button>
                  </form>

                  <button
                    onClick={goToDashboard}
                    className="w-full bg-white/5 border border-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/10 transition"
                  >
                    Go to Dashboard
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-green-400 font-semibold mb-1">
                          Bot Created Successfully!
                        </h3>
                        <p className="text-sm text-green-300/80 mb-2">
                          Your chatbot is ready to use
                        </p>
                        <p className="text-xs text-green-400/60 font-mono bg-green-500/10 px-2 py-1 rounded inline-block">
                          Bot ID: {botId}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 backdrop-blur-sm">
                    <h3 className="text-purple-400 font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Next Steps
                    </h3>
                    <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
                      <li>Go to your dashboard</li>
                      <li>Select your bot from the list</li>
                      <li>Start chatting with your AI assistant</li>
                    </ol>
                  </div>

                  <button
                    onClick={goToDashboard}
                    className="w-full bg-gradient-to-r from-purple-600 to-orange-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => {
                      setBotId(null);
                      setWebsiteUrl("");
                    }}
                    className="w-full bg-white/5 border border-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/10 transition"
                  >
                    Create Another Bot
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}