import React from 'react';
import { Scan, TrendingUp, Library } from 'lucide-react';
import Link from 'next/link';


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-950 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent">
            ScalpedEx
          </h1>
          <button className="px-4 py-2 bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors">
            Connect
          </button>
        </header>

        {/* Main CTA - Scanner */}
        <div className="mb-12 p-6 rounded-2xl bg-violet-900/20 backdrop-blur-sm border border-violet-800/50">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-4 rounded-full bg-violet-600">
              <Scan size={32} />
            </div>
            <h2 className="text-2xl font-semibold">Quick Scan</h2>
            <p className="text-violet-300">
              Instantly scan and evaluate your collectibles
            </p>
            <Link href="/scan" className="mt-4 px-8 py-3 bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors font-medium">
  Start Scanning
</Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-violet-900/20 backdrop-blur-sm border border-violet-800/50">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-violet-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Market Analysis</h3>
                <p className="text-violet-300">
                  Real-time market prices and trends for your collection
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-violet-900/20 backdrop-blur-sm border border-violet-800/50">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-violet-600">
                <Library size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Collection Manager</h3>
                <p className="text-violet-300">
                  Track and organize your entire collection effortlessly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}