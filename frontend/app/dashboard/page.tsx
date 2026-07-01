"use client";

import { useState, useEffect, useRef } from "react";
import { getToken, getUserRole, logout } from "@/lib/auth";
import { API_BASE_URL } from "@/lib/constants";
import Link from "next/link";
import {
  Bot, Plus, Globe, ExternalLink, Loader, CheckCircle,
  Clock, AlertCircle, LogOut, Users, LayoutDashboard,
  Pencil, X, Copy, Trash2, Check, Code
} from "lucide-react";

type BotType = {
  bot_id: string;
  website_url: string;
  status: string;
  created_at: string;
  bot_name?: string;
  greeting_message?: string;
  primary_color?: string;
  background_color?: string;
  text_color?: string;
  logo_url?: string;
  show_branding?: boolean;
};

const COLOR_THEMES = [
  { name: "Ocean",    primary: "#2563eb", background: "#ffffff", text: "#111827" },
  { name: "Midnight", primary: "#7c3aed", background: "#0f0f1a", text: "#f1f5f9" },
  { name: "Forest",   primary: "#059669", background: "#f0fdf4", text: "#111827" },
  { name: "Sunset",   primary: "#ea580c", background: "#fff7ed", text: "#1c1917" },
  { name: "Rose",     primary: "#e11d48", background: "#fff1f2", text: "#111827" },
  { name: "Charcoal", primary: "#334155", background: "#f8fafc", text: "#0f172a" },
];

const PROGRESS_STEPS = [
  { label: "🕷️ Crawling your website...", duration: 5000 },
  { label: "📄 Reading and cleaning pages...", duration: 5000 },
  { label: "🧠 Training your AI bot...", duration: 5000 },
  { label: "💾 Saving to vector database...", duration: 5000 },
  { label: "⏳ Almost there, hang tight...", duration: 99999 },
];

function BotPreview({
  botName, greeting, primaryColor, bgColor, textColor, logoUrl,
}: {
  botName: string; greeting: string; primaryColor: string;
  bgColor: string; textColor: string; logoUrl?: string | null;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden border shadow-xl text-left w-full"
      style={{ backgroundColor: bgColor, borderColor: primaryColor + "44" }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ backgroundColor: primaryColor + "22", borderBottom: `1px solid ${primaryColor}33` }}
      >
        {logoUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={logoUrl} alt="logo" className="w-7 h-7 rounded-lg object-cover" />
        ) : (
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
            <Bot className="w-4 h-4 text-white" />
          </div>
        )}
        <span className="font-semibold text-sm" style={{ color: textColor }}>
          {botName || "AI Assistant"}
        </span>
      </div>

      {/* Messages */}
      <div className="p-3 space-y-2" style={{ backgroundColor: bgColor, minHeight: 90 }}>
        <div className="flex justify-start">
          <div
            className="max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed"
            style={{ backgroundColor: primaryColor + "18", border: `1px solid ${primaryColor}33`, color: textColor }}
          >
            {greeting || "Hi! How can I help you today?"}
          </div>
        </div>
        <div className="flex justify-end">
          <div
            className="max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed text-white"
            style={{ backgroundColor: primaryColor }}
          >
            Tell me about your services
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="px-3 py-2 border-t" style={{ borderColor: primaryColor + "33", backgroundColor: bgColor }}>
        <div
          className="rounded-lg px-3 py-2 text-xs border"
          style={{ borderColor: primaryColor + "44", color: textColor + "66", backgroundColor: bgColor }}
        >
          Ask a question...
        </div>
      </div>
    </div>
  );
}

function ThemePicker({
  selected, onChange,
}: { selected: number; onChange: (i: number) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-3">Color Theme</label>
      <div className="grid grid-cols-3 gap-2">
        {COLOR_THEMES.map((theme, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-left ${
              selected === i
                ? "border-purple-500 bg-purple-500/10"
                : "border-white/10 bg-white/5 hover:border-white/30"
            }`}
          >
            <div className="flex gap-1 flex-shrink-0">
              <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: theme.primary }} />
              <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: theme.background }} />
            </div>
            <span className="text-xs text-gray-300 truncate">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [bots, setBots] = useState<BotType[]>([]);
  const [loadingBots, setLoadingBots] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  // Create form state
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [botName, setBotName] = useState("");
  const [greetingMessage, setGreetingMessage] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [showBranding, setShowBranding] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Polling
  const [creatingBotId, setCreatingBotId] = useState<string | null>(null);
  const [progressStep, setProgressStep] = useState(0);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Bot card actions
  const [copiedBotId, setCopiedBotId] = useState<string | null>(null);
  const [deletingBotId, setDeletingBotId] = useState<string | null>(null);

  // Embed modal
  const [embedBotId, setEmbedBotId] = useState<string | null>(null);
  const [embedTab, setEmbedTab] = useState<"iframe" | "widget">("iframe");
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Edit modal
  const [editingBot, setEditingBot] = useState<BotType | null>(null);
  const [editBotName, setEditBotName] = useState("");
  const [editGreeting, setEditGreeting] = useState("");
  const [editSelectedTheme, setEditSelectedTheme] = useState(0);
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null);
  const [editLogoPreviewUrl, setEditLogoPreviewUrl] = useState<string | null>(null);
  const [editCurrentLogoUrl, setEditCurrentLogoUrl] = useState<string | null>(null);
  const [editShowBranding, setEditShowBranding] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) { window.location.href = "/login"; return; }
    setRole(getUserRole());
    fetchBots();
  }, []);

  useEffect(() => {
    if (!creatingBotId) return;
    const step = PROGRESS_STEPS[progressStep];
    if (!step || progressStep >= PROGRESS_STEPS.length - 1) return;
    stepTimerRef.current = setTimeout(() => setProgressStep(p => p + 1), step.duration);
    return () => { if (stepTimerRef.current) clearTimeout(stepTimerRef.current); };
  }, [creatingBotId, progressStep]);

  async function fetchBots() {
    try {
      const res = await fetch(`${API_BASE_URL}/bots/my`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok) setBots(data);
    } catch { console.error("Failed to fetch bots"); }
    finally { setLoadingBots(false); }
  }

  function startPolling(botId: string) {
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/bots/${botId}/status`);
        const data = await res.json();
        if (data.status === "ready" || data.status === "failed") {
          stopPolling();
          setCreatingBotId(null);
          setProgressStep(0);
          await fetchBots();
        }
      } catch { console.error("Polling error"); }
    }, 5000);
  }

  function stopPolling() {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
  }

  async function handleCreateBot(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const theme = COLOR_THEMES[selectedTheme];

    try {
      const token = getToken();
      let uploadedLogoUrl = "";

      if (logoFile) {
        const formData = new FormData();
        formData.append("file", logoFile);
        const uploadRes = await fetch(`${API_BASE_URL}/bots/upload-logo`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) { setError("Logo upload failed"); return; }
        uploadedLogoUrl = uploadData.logo_url;
      }

      const res = await fetch(`${API_BASE_URL}/bots/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          website_url: websiteUrl,
          bot_name: botName || null,
          greeting_message: greetingMessage || null,
          primary_color: theme.primary,
          background_color: theme.background,
          text_color: theme.text,
          logo_url: uploadedLogoUrl || null,
          show_branding: showBranding,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Failed to create bot"); return; }

      setWebsiteUrl("");
      setBotName("");
      setGreetingMessage("");
      setLogoFile(null);
      setLogoPreviewUrl(null);
      setSelectedTheme(0);
      setCreatingBotId(data.bot_id);
      setProgressStep(0);
      startPolling(data.bot_id);
    } catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  }

  async function handleDeleteBot(botId: string) {
    if (!confirm("Delete this bot? This cannot be undone.")) return;
    setDeletingBotId(botId);
    try {
      const res = await fetch(`${API_BASE_URL}/bots/${botId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) await fetchBots();
    } catch { console.error("Delete failed"); }
    finally { setDeletingBotId(null); }
  }

  async function handleCopyLink(botId: string) {
    const url = `${window.location.origin}/chat/${botId}`;
    await navigator.clipboard.writeText(url);
    setCopiedBotId(botId);
    setTimeout(() => setCopiedBotId(null), 2000);
  }

  function getEmbedCodes(botId: string) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const chatUrl = `${origin}/chat/${botId}`;
    return {
      iframe: `<iframe\n  src="${chatUrl}"\n  width="400"\n  height="600"\n  style="border:none; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.2);"\n  title="AI Chat"\n></iframe>`,
      widget: `<script\n  src="${origin}/widget.js"\n  data-bot-id="${botId}"\n></script>`,
    };
  }

  async function handleCopyEmbed(code: string) {
    await navigator.clipboard.writeText(code);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  }

  function openEmbedModal(botId: string) {
    setEmbedBotId(botId);
    setEmbedTab("iframe");
    setCopiedEmbed(false);
  }

  function openEditModal(bot: BotType) {
    setEditingBot(bot);
    setEditBotName(bot.bot_name || "");
    setEditGreeting(bot.greeting_message || "");
    setEditCurrentLogoUrl(bot.logo_url || null);
    setEditLogoFile(null);
    setEditLogoPreviewUrl(null);
    const themeIdx = COLOR_THEMES.findIndex(t => t.primary === bot.primary_color);
    setEditSelectedTheme(themeIdx >= 0 ? themeIdx : 0);
    setEditShowBranding(bot.show_branding ?? true);
    setEditError("");
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingBot) return;
    setEditLoading(true);
    setEditError("");
    const theme = COLOR_THEMES[editSelectedTheme];

    try {
      const token = getToken();
      let logoUrl = editCurrentLogoUrl;

      if (editLogoFile) {
        const formData = new FormData();
        formData.append("file", editLogoFile);
        const uploadRes = await fetch(`${API_BASE_URL}/bots/upload-logo`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) { setEditError("Logo upload failed"); return; }
        logoUrl = uploadData.logo_url;
      }

      const res = await fetch(`${API_BASE_URL}/bots/${editingBot.bot_id}/customize`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          bot_name: editBotName || null,
          greeting_message: editGreeting || null,
          primary_color: theme.primary,
          background_color: theme.background,
          text_color: theme.text,
          logo_url: logoUrl,
          show_branding: editShowBranding,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setEditError(data.detail || "Failed to save changes");
        return;
      }

      setEditingBot(null);
      await fetchBots();
    } catch { setEditError("Something went wrong"); }
    finally { setEditLoading(false); }
  }

  const getStatusIcon = (status: string) => {
    if (status === "ready") return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (status === "processing") return <Clock className="w-4 h-4 text-yellow-400 animate-spin" />;
    return <AlertCircle className="w-4 h-4 text-red-400" />;
  };

  const getStatusColor = (status: string) => {
    if (status === "ready") return "text-green-400 bg-green-500/10 border-green-500/20";
    if (status === "processing") return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    return "text-red-400 bg-red-500/10 border-red-500/20";
  };

  const createTheme = COLOR_THEMES[selectedTheme];
  const editTheme = COLOR_THEMES[editSelectedTheme];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-orange-900/20 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Header */}
      <header className="relative border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
              CustomBot
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition text-sm">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </a>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Logged in as <span className="text-purple-400 font-medium">{role}</span>
          </p>
        </div>

        {/* Create Bot Section */}
        {role === "client" && (
          <div className="mb-12">
            <div className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                  <Plus className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold">Create New Bot</h2>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
                  {error}
                </div>
              )}

              {creatingBotId && (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Loader className="w-5 h-5 text-purple-400 animate-spin" />
                    <p className="text-purple-300 font-medium">{PROGRESS_STEPS[progressStep]?.label}</p>
                  </div>
                  <div className="space-y-2">
                    {PROGRESS_STEPS.slice(0, -1).map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {i < progressStep ? (
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        ) : i === progressStep ? (
                          <Loader className="w-4 h-4 text-purple-400 animate-spin flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-gray-600 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${i <= progressStep ? "text-white" : "text-gray-500"}`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!creatingBotId && (
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Form */}
                  <form onSubmit={handleCreateBot} className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
                      <input
                        type="url"
                        placeholder="https://example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        Enter the website you want to create a chatbot for
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Bot Name <span className="text-gray-500">(optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sharma Electronics Assistant"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition"
                        value={botName}
                        onChange={(e) => setBotName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Greeting Message <span className="text-gray-500">(optional)</span>
                      </label>
                      <textarea
                        placeholder="e.g. Hi! I'm here to help you with any questions about our products."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition resize-none"
                        rows={2}
                        value={greetingMessage}
                        onChange={(e) => setGreetingMessage(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Brand Logo <span className="text-gray-500">(optional)</span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 focus:outline-none transition text-sm"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setLogoFile(file);
                          setLogoPreviewUrl(file ? URL.createObjectURL(file) : null);
                        }}
                      />
                    </div>

                    <ThemePicker selected={selectedTheme} onChange={setSelectedTheme} />

                    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 opacity-60">
                      <div>
                        <p className="text-sm font-medium text-gray-300">Show &quot;Powered by CustomBot&quot;</p>
                        <p className="text-xs text-orange-400">Remove branding · <a href="#pricing" className="underline hover:text-orange-300">Get a paid plan</a></p>
                      </div>
                      <div className="relative w-12 h-6 rounded-full bg-purple-600 flex-shrink-0 cursor-not-allowed">
                        <span className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full translate-x-7" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-600 to-orange-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      {loading ? <><Loader className="w-5 h-5 animate-spin" />Submitting...</> : <><Plus className="w-5 h-5" />Create Bot</>}
                    </button>
                  </form>

                  {/* Live Preview */}
                  <div className="lg:w-72 xl:w-80">
                    <p className="text-sm font-medium text-gray-300 mb-3">Live Preview</p>
                    <BotPreview
                      botName={botName}
                      greeting={greetingMessage}
                      primaryColor={createTheme.primary}
                      bgColor={createTheme.background}
                      textColor={createTheme.text}
                      logoUrl={logoPreviewUrl}
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">Updates as you type</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bots List */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            Your Bots
          </h2>

          {loadingBots && (
            <div className="text-center py-12">
              <Loader className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
              <p className="text-gray-400">Loading bots...</p>
            </div>
          )}

          {!loadingBots && bots.length === 0 && !creatingBotId && (
            <div className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
              <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-400">No bots yet</h3>
              <p className="text-gray-500">Create your first bot to get started!</p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {bots.map((bot) => {
              const chatUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/chat/${bot.bot_id}`;
              return (
                <div
                  key={bot.bot_id}
                  className="group bg-gradient-to-br from-purple-900/20 to-orange-900/20 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-purple-500/20">
                        <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm sm:text-base">
                          {bot.bot_name || "Website Bot"}
                        </h3>
                        <p className="text-xs text-gray-500">{new Date(bot.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(bot.status)}`}>
                      {getStatusIcon(bot.status)}
                      {bot.status}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Website</p>
                      <p className="text-sm text-gray-300 truncate">{bot.website_url}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Chat URL</p>
                      <a
                        href={chatUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        <span className="truncate">{chatUrl}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                    <button
                      onClick={() => handleCopyLink(bot.bot_id)}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-400 transition px-2.5 py-1.5 rounded-lg hover:bg-green-500/10"
                    >
                      {copiedBotId === bot.bot_id ? (
                        <><Check className="w-3.5 h-3.5" />Copied!</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" />Copy Link</>
                      )}
                    </button>

                    <button
                      onClick={() => openEmbedModal(bot.bot_id)}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-400 transition px-2.5 py-1.5 rounded-lg hover:bg-blue-500/10"
                    >
                      <Code className="w-3.5 h-3.5" />
                      Embed
                    </button>

                    <button
                      onClick={() => openEditModal(bot)}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-purple-400 transition px-2.5 py-1.5 rounded-lg hover:bg-purple-500/10"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteBot(bot.bot_id)}
                      disabled={deletingBotId === bot.bot_id}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 ml-auto disabled:opacity-50"
                    >
                      {deletingBotId === bot.bot_id ? (
                        <Loader className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Admin Controls */}
        {role === "super_admin" && (
          <div className="mt-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
              Admin Controls
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <Link href="/admin" className="group bg-gradient-to-br from-green-900/20 to-green-600/10 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 hover:border-green-500/50 transition-all">
                <LayoutDashboard className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-lg sm:text-xl font-bold mb-1">Admin Panel</h3>
                <p className="text-sm text-gray-400">Full platform overview and controls</p>
              </Link>
              <Link href="/admin/users" className="group bg-gradient-to-br from-purple-900/20 to-purple-600/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
                <Users className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="text-lg sm:text-xl font-bold mb-1">View All Users</h3>
                <p className="text-sm text-gray-400">Manage user accounts and permissions</p>
              </Link>
              <Link href="/admin/bots" className="group bg-gradient-to-br from-orange-900/20 to-orange-600/10 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6 hover:border-orange-500/50 transition-all">
                <Bot className="w-8 h-8 text-orange-400 mb-3" />
                <h3 className="text-lg sm:text-xl font-bold mb-1">View All Bots</h3>
                <p className="text-sm text-gray-400">Monitor all chatbots in the system</p>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Embed Modal */}
      {embedBotId && (() => {
        const codes = getEmbedCodes(embedBotId);
        const activeCode = embedTab === "iframe" ? codes.iframe : codes.widget;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-6">
            <div className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-2xl">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-bold">Embed Your Bot</h2>
                </div>
                <button onClick={() => setEmbedBotId(null)} className="text-gray-400 hover:text-white transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <p className="text-sm text-gray-400">
                  Choose how you want to add this chatbot to your website.
                </p>

                {/* Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEmbedTab("iframe"); setCopiedEmbed(false); }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                      embedTab === "iframe"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    iframe (inline box)
                  </button>
                  <button
                    onClick={() => { setEmbedTab("widget"); setCopiedEmbed(false); }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                      embedTab === "widget"
                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                        : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    Floating bubble (script)
                  </button>
                </div>

                {/* Description */}
                {embedTab === "iframe" ? (
                  <p className="text-xs text-gray-500">
                    Paste this anywhere in your HTML to show the chat as a fixed-size box on the page.
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    Paste this just before <code className="text-purple-400">&lt;/body&gt;</code> to add a floating chat bubble to the bottom-right corner of your website.
                  </p>
                )}

                {/* Code block */}
                <div className="relative">
                  <pre className="bg-black/50 border border-white/10 rounded-xl p-4 text-xs text-green-300 overflow-x-auto whitespace-pre-wrap break-all">
                    {activeCode}
                  </pre>
                  <button
                    onClick={() => handleCopyEmbed(activeCode)}
                    className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-xs text-gray-300 transition"
                  >
                    {copiedEmbed ? (
                      <><Check className="w-3.5 h-3.5 text-green-400" />Copied!</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" />Copy</>
                    )}
                  </button>
                </div>

                {/* Test tip */}
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-3 text-xs text-purple-300">
                  <strong>Test it:</strong> Create a blank <code>.html</code> file, paste the code inside a <code>&lt;body&gt;</code> tag, and open it in your browser.
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Edit Bot Modal */}
      {editingBot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-6">
          <div className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 sm:p-8 border-b border-white/10">
              <h2 className="text-xl font-bold">Edit Bot Customization</h2>
              <button onClick={() => setEditingBot(null)} className="text-gray-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {editError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
                  {editError}
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Edit Form */}
                <form onSubmit={handleSaveEdit} className="flex-1 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bot Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Sharma Electronics Assistant"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition"
                      value={editBotName}
                      onChange={(e) => setEditBotName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Greeting Message</label>
                    <textarea
                      placeholder="e.g. Hi! I'm here to help you."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition resize-none"
                      rows={2}
                      value={editGreeting}
                      onChange={(e) => setEditGreeting(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Brand Logo</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 focus:outline-none transition text-sm"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setEditLogoFile(file);
                        setEditLogoPreviewUrl(file ? URL.createObjectURL(file) : null);
                      }}
                    />
                    {editCurrentLogoUrl && !editLogoFile && (
                      <p className="text-xs text-gray-500 mt-1">Current logo kept unless you upload a new one</p>
                    )}
                  </div>

                  <ThemePicker selected={editSelectedTheme} onChange={setEditSelectedTheme} />

                  <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 opacity-60">
                    <div>
                      <p className="text-sm font-medium text-gray-300">Show &quot;Powered by CustomBot&quot;</p>
                      <p className="text-xs text-orange-400">Remove branding · <a href="#pricing" className="underline hover:text-orange-300">Get a paid plan</a></p>
                    </div>
                    <div className="relative w-12 h-6 rounded-full bg-purple-600 flex-shrink-0 cursor-not-allowed">
                      <span className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full translate-x-7" />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingBot(null)}
                      className="flex-1 bg-white/5 border border-white/10 text-gray-300 py-3 rounded-xl font-medium hover:bg-white/10 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={editLoading}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-orange-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                    >
                      {editLoading && <Loader className="w-4 h-4 animate-spin" />}
                      {editLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>

                {/* Edit Preview */}
                <div className="lg:w-64 xl:w-72">
                  <p className="text-sm font-medium text-gray-300 mb-3">Live Preview</p>
                  <BotPreview
                    botName={editBotName}
                    greeting={editGreeting}
                    primaryColor={editTheme.primary}
                    bgColor={editTheme.background}
                    textColor={editTheme.text}
                    logoUrl={editLogoPreviewUrl || editCurrentLogoUrl}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
