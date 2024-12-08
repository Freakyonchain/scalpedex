// app/market/page.tsx
'use client';

import React from 'react';
import { Flame, TrendingUp, TrendingDown, DollarSign, Package, Timer, ArrowRight } from 'lucide-react';

export default function MarketPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Market Heat */}
      <div className="bg-gradient-to-r from-violet-900/20 via-red-900/20 to-orange-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="text-orange-500" size={24} />
          <h2 className="text-xl font-bold text-white">Market Heat</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-orange-400">🔥 Ultra-Hot</span>
              <TrendingUp className="text-green-400" size={20} />
            </div>
            <h3 className="text-white font-medium">Scarlet & Violet 151</h3>
            <p className="text-sm text-violet-300">Volume 24h: +243%</p>
          </div>
          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-400">⚡ Trending</span>
              <TrendingUp className="text-green-400" size={20} />
            </div>
            <h3 className="text-white font-medium">Paradox Rift BB</h3>
            <p className="text-sm text-violet-300">Volume 24h: +121%</p>
          </div>
          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-violet-400">📈 Rising</span>
              <TrendingUp className="text-green-400" size={20} />
            </div>
            <h3 className="text-white font-medium">Paldean Fates</h3>
            <p className="text-sm text-violet-300">Précos: +89%</p>
          </div>
        </div>
      </div>

      {/* Scalping Opportunities */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">🎯 Opportunités Détectées</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Opportunity Card */}
          <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-violet-800/30 rounded-lg shrink-0" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-white">ETB 151</h3>
                    <p className="text-sm text-violet-300">Retail: 59.99€</p>
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">
                    +42% Margin
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-violet-300">
                    Market Price: <span className="text-white font-medium">89.99€</span>
                  </div>
                  <button className="text-violet-400 hover:text-white transition-colors flex items-center gap-1">
                    Details <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* More opportunities... */}
        </div>
      </div>

      {/* Live Market Feed */}
      <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
        <h2 className="text-xl font-bold text-white mb-4">📊 Live Market Feed</h2>
        <div className="space-y-3">
          {/* Live Sale */}
          <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Timer size={20} className="text-violet-400" />
              <div>
                <h4 className="text-white font-medium">Charizard VSTAR</h4>
                <p className="text-sm text-violet-300">Brilliant Stars</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">89.99€</p>
              <p className="text-sm text-green-400">Vendu il y a 2min</p>
            </div>
          </div>

          {/* More live sales... */}
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Package size={20} className="text-violet-400" />
            <h3 className="text-white font-medium">Volume 24h</h3>
          </div>
          <p className="text-2xl font-bold text-white">127,842€</p>
          <p className="text-sm text-green-400 flex items-center gap-1 mt-1">
            <TrendingUp size={16} /> +12.3%
          </p>
        </div>

        {/* More stats... */}
      </div>
    </div>
  );
}