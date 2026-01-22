"use client";

import React, { useState } from 'react';
import { Bot, Sparkles, Zap, MessageSquare, ArrowRight, Globe, Code, Menu, X } from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-orange-900/20 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Header */}
      <header className="fixed top-0 w-full bg-black/50 backdrop-blur-xl border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
              CustomBot
            </span>
          </div>

          {/* Desktop Navigation */}
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10">
            <nav className="flex flex-col px-4 py-4 space-y-4">
              <a 
                href="#features" 
                className="text-gray-400 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className="text-gray-400 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a 
                href="/login" 
                className="text-gray-400 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </a>
              <a 
                href="/register"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-600 rounded-full text-center font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-5xl mx-auto mb-12 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full mb-6 sm:mb-8 border border-white/10">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
              <span className="text-xs sm:text-sm font-medium text-gray-300">
                Powered by Advanced AI Technology
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 sm:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-orange-200 bg-clip-text text-transparent">
                TURN YOUR CONTENT
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-orange-400 to-purple-400 bg-clip-text text-transparent">
                INTO CONVERSATIONS.
              </span>
            </h1>
            
            <p className="text-base sm:text-xl text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform any website into an intelligent AI chatbot in minutes. 
              Instant answers, 24/7 availability, unlimited patience. That's CustomBot.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="/register"
                className="group px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-orange-600 text-white text-base sm:text-lg font-bold rounded-full hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Start 7 Days Trial
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition" />
              </a>
              <a
                href="#demo"
                className="px-8 sm:px-10 py-4 sm:py-5 bg-white/5 backdrop-blur-sm border border-white/10 text-white text-base sm:text-lg font-bold rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                Watch Demo
              </a>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-20 sm:mb-32" id="features">
            <div className="group relative bg-gradient-to-br from-purple-900/20 to-purple-600/10 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 sm:p-8 hover:border-purple-500/50 transition-all hover:scale-105">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/0 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition border border-purple-500/20">
                  <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">
                  Lightning Fast Setup
                </h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  Enter your URL and watch your AI chatbot come to life in seconds. No coding required.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-orange-900/20 to-orange-600/10 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-6 sm:p-8 hover:border-orange-500/50 transition-all hover:scale-105">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-500/0 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition border border-orange-500/20">
                  <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">
                  Smart Conversations
                </h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  AI that understands context and delivers human-like responses to your customers.
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-purple-900/20 to-orange-600/10 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 sm:p-8 hover:border-orange-500/50 transition-all hover:scale-105">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/0 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500/10 to-orange-500/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition border border-purple-500/20">
                  <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">
                  Share Anywhere
                </h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  Get a unique URL for your chatbot and share it instantly with your team or customers.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-20 sm:mb-32">
            <div className="text-center">
              <div className="text-3xl sm:text-6xl font-black bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                10K+
              </div>
              <div className="text-gray-400 text-xs sm:text-lg">Active Bots</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-6xl font-black bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                99.9%
              </div>
              <div className="text-gray-400 text-xs sm:text-lg">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-6xl font-black bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                24/7
              </div>
              <div className="text-gray-400 text-xs sm:text-lg">Support</div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="max-w-4xl mx-auto p-8 sm:p-16 bg-gradient-to-br from-purple-900/30 to-orange-900/30 backdrop-blur-xl rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/5 to-orange-500/5" />
              <div className="relative">
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6">
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    NEVER MISS A
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
                    CUSTOMER QUESTION
                  </span>
                </h2>
                <p className="text-base sm:text-xl text-gray-400 mb-6 sm:mb-10">
                  Let AI handle repetitive questions while you focus on growing your business.
                </p>
                <a
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-purple-600 to-orange-600 text-white text-base sm:text-lg font-bold rounded-full hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all"
                >
                  Create Your Bot Now
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 sm:mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
                CustomBot
              </span>
            </div>
            <p className="text-gray-500 text-sm sm:text-base">
              © 2026 CustomBot. All rights reserved.
            </p>
            <div className="flex gap-4 sm:gap-8">
              <a href="#" className="text-gray-500 hover:text-purple-400 transition text-sm sm:text-base">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-purple-400 transition text-sm sm:text-base">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-purple-400 transition text-sm sm:text-base">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}