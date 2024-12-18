'use client';

import React from 'react';
import { Megaphone, Timer, Sparkles, AlertCircle, ShoppingBag, Calendar, ArrowUpRight, ArrowRight } from 'lucide-react';

export default function NewsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Breaking Alert */}
      <div className="bg-gradient-to-r from-orange-900/20 via-red-900/20 to-red-900/20 rounded-xl border border-red-800/50 p-4 animate-pulse">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="text-red-400" size={20} />
          <span className="text-red-400 font-medium text-sm">BREAKING</span>
        </div>
        <h2 className="text-white font-bold mb-1">Restock Micromania imminent ! 🚨</h2>
        <p className="text-sm text-red-200">Plusieurs magasins vont recevoir des 151 ce weekend</p>
      </div>

      {/* Prochaines Sorties */}
      <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="text-violet-400" size={24} />
            <h2 className="text-xl font-bold text-white">Drop Calendar</h2>
          </div>
          <button className="text-violet-400 text-sm hover:text-white transition-colors flex items-center gap-1">
            Voir tout <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid gap-3">
          <div className="bg-black/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-400 font-medium">Dans 2 jours</span>
              <span className="px-2 py-1 bg-violet-500/20 text-violet-300 rounded-full text-xs">Hype: 98%</span>
            </div>
            <h3 className="text-white font-medium">Crown Zenith Elite Trainer Box</h3>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-violet-300">MSRP: 59.99€</p>
              <span className="text-green-400 text-sm">Prévision: 89.99€ 📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guides & Tips */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">🎓 Guides du Scalpeur</h2>
          <button className="text-violet-400 text-sm hover:text-white transition-colors flex items-center gap-1">
            Plus de guides <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="group bg-violet-900/20 hover:bg-violet-900/30 transition-colors backdrop-blur-sm rounded-xl border border-violet-800/50 p-4 cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-violet-800 rounded-lg flex items-center justify-center shrink-0">
                <ShoppingBag className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-medium text-white group-hover:text-violet-400 transition-colors">Guide des Précommandes</h3>
                <p className="text-sm text-violet-300 mt-1">Les meilleurs sites et techniques pour préco au MSRP</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-violet-400">Lire le guide</span>
                  <ArrowUpRight size={14} className="text-violet-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News Feed */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">📰 Dernières News</h2>
        <div className="space-y-3">
          <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
            <div className="flex items-center gap-2 text-sm text-violet-400 mb-2">
              <Timer size={16} />
              <span>Il y a 1 heure</span>
              <span className="px-2 py-0.5 bg-violet-500/20 rounded-full">Retail</span>
            </div>
            <h3 className="text-white font-medium">Leclerc lance sa nouvelle politique TCG 😱</h3>
            <p className="text-sm text-violet-300 mt-1">Limitation à 2 produits par référence et par personne...</p>
            <button className="text-violet-400 text-sm hover:text-white transition-colors flex items-center gap-1 mt-3">
              Lire plus <ArrowRight size={16} />
            </button>
          </div>

          <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-4">
            <div className="flex items-center gap-2 text-sm text-violet-400 mb-2">
              <Sparkles size={16} />
              <span>Il y a 3 heures</span>
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">Success Story</span>
            </div>
            <h3 className="text-white font-medium">Il scalpe 50 ETB en 10 minutes 🏆</h3>
            <p className="text-sm text-violet-300 mt-1">Comment @ScalpMaster a réussi son coup chez Cultura...</p>
            <button className="text-violet-400 text-sm hover:text-white transition-colors flex items-center gap-1 mt-3">
              Lire plus <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}