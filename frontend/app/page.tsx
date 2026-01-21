import React from 'react';
import { Bot, Sparkles, Zap, MessageSquare, ArrowRight, Globe, Code, Cpu } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-orange-900/20 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Header */}
      <header className="fixed top-0 w-full bg-black/50 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
              CustomBot
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="/login" className="text-gray-400 hover:text-white transition-colors">
              Login
            </a>
            <a 
              href="/register"
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-orange-600 rounded-full hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all font-semibold"
            >
              Get Started
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-5xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full mb-8 border border-white/10">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">
                Powered by Advanced AI Technology
              </span>
            </div>
            
            <h1 className="text-7xl md:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-orange-200 bg-clip-text text-transparent">
                YOUR WEBSITE,
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-orange-400 to-purple-400 bg-clip-text text-transparent">
                YOUR AUTHORITY.
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform any website into an intelligent AI chatbot in minutes. 
              Keep your team connected and productive with instant, accurate responses 24/7.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="group px-10 py-5 bg-gradient-to-r from-purple-600 to-orange-600 text-white text-lg font-bold rounded-full hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Start 7 Days Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </a>
              <a
                href="#demo"
                className="px-10 py-5 bg-white/5 backdrop-blur-sm border border-white/10 text-white text-lg font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                Watch Demo
              </a>
            </div>
          </div>

          {/* Feature Cards - Horizontal Layout */}
          <div className="grid md:grid-cols-3 gap-6 mb-32" id="features">
            <div className="group relative bg-gradient-to-br from-purple-900/20 to-purple-600/10 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 hover:border-purple-500/50 transition-all hover:scale-105">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/0 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition border border-purple-500/20">
                  <Zap className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  Lightning Fast Setup
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Enter your URL and watch your AI chatbot come to life in seconds. No coding required.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-orange-900/20 to-orange-600/10 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-8 hover:border-orange-500/50 transition-all hover:scale-105">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/0 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition border border-orange-500/20">
                  <MessageSquare className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  Smart Conversations
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  AI that understands context and delivers human-like responses to your customers.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-purple-900/20 to-orange-600/10 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 hover:border-orange-500/50 transition-all hover:scale-105">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/0 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/10 to-orange-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition border border-purple-500/20">
                  <Code className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">
                  Share Anywhere
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Get a unique URL for your chatbot and share it instantly with your team or customers.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-32">
            <div className="text-center">
              <div className="text-6xl font-black bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <div className="text-gray-400 text-lg">Active Bots</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-black bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent mb-2">
                99.9%
              </div>
              <div className="text-gray-400 text-lg">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-black bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-gray-400 text-lg">Support</div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="max-w-4xl mx-auto p-16 bg-gradient-to-br from-purple-900/30 to-orange-900/30 backdrop-blur-xl rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/5 to-orange-500/5" />
              <div className="relative">
                <h2 className="text-5xl md:text-6xl font-black mb-6">
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    GET YOUR
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
                    AUTHORITY
                  </span>
                </h2>
                <p className="text-xl text-gray-400 mb-10">
                  Establish control and authority over your team's file-sharing with speed.
                </p>
                <a
                  href="/register"
                  className="inline-flex items-center gap-2 px-12 py-6 bg-gradient-to-r from-purple-600 to-orange-600 text-white text-lg font-bold rounded-full hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all"
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-32">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
                CustomBot
              </span>
            </div>
            <p className="text-gray-500">
              © 2026 CustomBot. All rights reserved.
            </p>
            <div className="flex gap-8">
              <a href="#" className="text-gray-500 hover:text-purple-400 transition">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-purple-400 transition">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-purple-400 transition">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}