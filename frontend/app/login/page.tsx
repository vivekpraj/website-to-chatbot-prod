"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveToken, getToken, removeToken } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/constants";

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

  // Check login status on mount
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        {!isLoggedIn ? (
          <>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Login</h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-600 hover:underline font-medium">
                Register here
              </a>
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Create Bot</h1>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Logout
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {!botId ? (
              <>
                <form onSubmit={handleCreateBot}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Enter the website URL you want to create a chatbot for
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                  >
                    {creating ? "Creating Bot..." : "Create Bot"}
                  </button>
                </form>

                <button
                  onClick={goToDashboard}
                  className="w-full mt-3 bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Go to Dashboard
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg
                      className="w-6 h-6 text-green-600 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <div>
                      <h3 className="text-green-800 font-semibold mb-1">
                        Bot Created Successfully!
                      </h3>
                      <p className="text-sm text-green-700 mb-2">
                        Your chatbot has been created and is ready to use.
                      </p>
                      <p className="text-xs text-green-600 font-mono bg-green-100 px-2 py-1 rounded inline-block">
                        Bot ID: {botId}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-blue-800 font-semibold mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Next Steps
                  </h3>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>Go to your dashboard</li>
                    <li>Select your bot from the list</li>
                    <li>Start chatting with your AI assistant</li>
                  </ol>
                </div>

                <button
                  onClick={goToDashboard}
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  Go to Dashboard
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => {
                    setBotId(null);
                    setWebsiteUrl("");
                  }}
                  className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Create Another Bot
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}