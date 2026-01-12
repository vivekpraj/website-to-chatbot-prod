import React from 'react';
import { Bot, Sparkles, Zap, MessageSquare, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FEF3E2] via-[#FAF8F1] to-[#F5F1E8]">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-[#E5E7EB] z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#111827] rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#111827]">
              CustomBot
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#features" className="text-[#6B7280] hover:text-[#2563EB] transition">
              Features
            </a>
            <a href="/login" className="text-[#6B7280] hover:text-[#2563EB] transition">
              Login
            </a>
            <a 
              href="/register"
              className="px-6 py-2.5 bg-[#111827] text-white rounded-full hover:bg-[#1f2937] hover:shadow-lg hover:scale-105 transition-all"
            >
              Get Started
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#EFF6FF] rounded-full mb-6 border border-[#E5E7EB]">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span className="text-sm font-medium text-[#2563EB]">
                AI-Powered Customer Support
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight text-[#111827]">
              Transform Your Website
              <br />
              Into An AI Chatbot
            </h1>
            
            <p className="text-xl text-[#6B7280] mb-10 max-w-2xl mx-auto leading-relaxed">
              Create intelligent chatbots from any website in minutes. 
              Powered by advanced AI to deliver instant, accurate responses to your customers 24/7.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="group px-8 py-4 bg-[#111827] text-white text-lg font-semibold rounded-full hover:bg-[#1f2937] hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Start Building Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </a>
            </div>
          </div>

          {/* Features Grid */}
          <div id="features" className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="group p-8 bg-white rounded-3xl border border-[#E5E7EB] hover:border-[#2563EB] hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-[#111827] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#111827]">
                Lightning Fast Setup
              </h3>
              <p className="text-[#6B7280] leading-relaxed">
                Just provide your website URL and watch as CustomBot crawls, learns, and creates your chatbot in minutes.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-3xl border border-[#E5E7EB] hover:border-[#2563EB] hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-[#111827] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#111827]">
                Smart Conversations
              </h3>
              <p className="text-[#6B7280] leading-relaxed">
                Powered by advanced AI models that understand context and deliver human-like responses to your visitors.
              </p>
            </div>

            <div className="group p-8 bg-white rounded-3xl border border-[#E5E7EB] hover:border-[#2563EB] hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-[#111827] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#111827]">
                Easy Integration
              </h3>
              <p className="text-[#6B7280] leading-relaxed">
                Embed your chatbot anywhere with a simple code snippet. Works seamlessly on any website or platform.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-32 text-center">
            <div className="max-w-3xl mx-auto p-12 bg-[#111827] rounded-3xl shadow-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-[#9CA3AF] mb-8">
                Join thousands of businesses using CustomBot to automate their customer support.
              </p>
              <a
                href="/register"
                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-[#111827] text-lg font-bold rounded-full hover:bg-[#F9FAFB] hover:shadow-2xl hover:scale-105 transition-all"
              >
                Create Your Bot Now
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#111827] rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#111827]">
                CustomBot
              </span>
            </div>
            <p className="text-[#6B7280]">
              © 2026 CustomBot. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-[#6B7280] hover:text-[#2563EB] transition">
                Privacy
              </a>
              <a href="#" className="text-[#6B7280] hover:text-[#2563EB] transition">
                Terms
              </a>
              <a href="#" className="text-[#6B7280] hover:text-[#2563EB] transition">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Updated: Jan 12, 2026