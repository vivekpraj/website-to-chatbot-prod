"use client";

import { useState } from 'react';
import { Bot, Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  ?? '';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '';
const EMAILJS_PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  ?? '';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        EMAILJS_PUBLIC_KEY,
      );
      setSent(true);
    } catch (err) {
      console.error('EmailJS error:', err);
      setError('Failed to send message. Please email us directly.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-orange-900/20 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Header */}
      <header className="relative border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
              CustomBot
            </span>
          </Link>
        </div>
      </header>

      <main className="relative max-w-xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500/20 to-orange-500/20 rounded-2xl border border-purple-500/20 mb-6">
            <Mail className="w-7 h-7 text-purple-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-3">
            <span className="bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">Contact Us</span>
          </h1>
          <p className="text-gray-400">
            Questions about pricing, your account, or anything else? We'll get back to you quickly.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Or email directly:{' '}
            <a href="mailto:vivekpraja007@gmail.com" className="text-purple-400 hover:underline">
              vivekpraja007@gmail.com
            </a>
          </p>
        </div>

        {sent ? (
          <div className="bg-gradient-to-br from-purple-900/30 to-orange-900/30 border border-green-500/20 rounded-3xl p-10 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
            <p className="text-gray-400">We'll get back to you as soon as possible.</p>
            <Link href="/" className="inline-block mt-6 text-purple-400 hover:text-purple-300 transition text-sm">
              ← Back to Home
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-gradient-to-br from-purple-900/20 to-orange-900/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-5"
          >
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Message</label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="What can we help you with?"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm resize-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-purple-600 to-orange-600 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 text-white font-semibold rounded-xl transition-all disabled:opacity-60 disabled:scale-100"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {loading ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}
      </main>

      <footer className="border-t border-white/10 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2026 CustomBot. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/pricing" className="text-gray-500 hover:text-purple-400 transition">Pricing</Link>
            <Link href="/privacy" className="text-gray-500 hover:text-purple-400 transition">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
