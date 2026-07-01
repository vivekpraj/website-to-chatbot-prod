import { Bot } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-orange-900/20 pointer-events-none" />

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

      <main className="relative max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <h1 className="text-4xl sm:text-5xl font-black mb-3">
          <span className="bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">Privacy Policy</span>
        </h1>
        <p className="text-gray-500 text-sm mb-12">Last updated: July 2026</p>

        <div className="space-y-10 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>
              When you register, we collect your name and email address. When you create a chatbot, we
              store the website URL you provide and the content we crawl from it to power your bot.
              We also log chat conversations to improve response quality and for debugging.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To create and manage your account</li>
              <li>To build and operate your AI chatbot</li>
              <li>To send important service-related emails (e.g., account changes)</li>
              <li>To improve the platform and fix issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Data Storage</h2>
            <p>
              Your account data is stored in a secure PostgreSQL database hosted on Neon. Chatbot
              knowledge (vector embeddings) is stored in Qdrant. Uploaded logos are stored on
              Cloudinary. We do not sell your data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Cookies</h2>
            <p>
              We use a JWT token stored in your browser's localStorage to keep you logged in.
              We do not use tracking cookies or third-party analytics at this time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Data Deletion</h2>
            <p>
              You can delete your bots at any time from the dashboard. To delete your account and
              all associated data, contact us at{' '}
              <a href="mailto:prajapati.vishal.2210@gmail.com" className="text-purple-400 hover:underline">
                prajapati.vishal.2210@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Contact</h2>
            <p>
              For any privacy-related questions, reach us at{' '}
              <a href="mailto:prajapati.vishal.2210@gmail.com" className="text-purple-400 hover:underline">
                prajapati.vishal.2210@gmail.com
              </a>.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/10 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2026 CustomBot. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/pricing" className="text-gray-500 hover:text-purple-400 transition">Pricing</Link>
            <Link href="/contact" className="text-gray-500 hover:text-purple-400 transition">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
