"use client";

import { Bot, Check, ArrowRight, Zap, Crown } from 'lucide-react';
import Link from 'next/link';

const FREE_FEATURES = [
  '1 chatbot',
  'Unlimited conversations',
  'Website crawler (up to 50 pages)',
  'Shareable chat link',
  'CustomBot branding shown',
];

const PRO_FEATURES = [
  'Up to 10 chatbots',
  'Unlimited conversations',
  'Website crawler (up to 500 pages)',
  'Shareable chat link',
  'Remove CustomBot branding',
  'Custom logo & colors',
  'Priority support',
];

export default function PricingPage() {
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
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-400 hover:text-white transition-colors text-sm">Login</Link>
            <Link href="/register" className="px-5 py-2 bg-gradient-to-r from-purple-600 to-orange-600 rounded-full text-sm font-semibold hover:scale-105 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Simple,</span>{' '}
            <span className="bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">Transparent Pricing</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
            Start for free. Upgrade when you need more bots or want to remove branding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Free Plan */}
          <div className="relative bg-gradient-to-br from-purple-900/20 to-purple-600/10 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Free</h2>
                <p className="text-xs text-gray-500">Get started at no cost</p>
              </div>
            </div>

            <div className="mb-8">
              <span className="text-5xl font-black text-white">$0</span>
              <span className="text-gray-400 ml-2">/ month</span>
            </div>

            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/register"
              className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl transition"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative bg-gradient-to-br from-orange-900/30 to-purple-900/30 backdrop-blur-xl border border-orange-500/30 rounded-3xl p-8">
            <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-purple-600 to-orange-600 rounded-full text-xs font-bold">
              POPULAR
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20">
                <Crown className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Pro</h2>
                <p className="text-xs text-gray-500">For growing businesses</p>
              </div>
            </div>

            <div className="mb-8">
              <span className="text-5xl font-black bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
                Custom
              </span>
              <p className="text-gray-400 text-sm mt-1">Contact us for pricing</p>
            </div>

            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 to-orange-600 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 text-white font-semibold rounded-xl transition-all"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2026 CustomBot. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-gray-500 hover:text-purple-400 transition">Privacy</Link>
            <Link href="/contact" className="text-gray-500 hover:text-purple-400 transition">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
