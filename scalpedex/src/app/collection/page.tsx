// app/collection/page.tsx
'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Package, DollarSign, AlertCircle, Search } from 'lucide-react';

export default function CollectionDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-violet-300">Valeur Totale</p>
              <h3 className="text-2xl font-bold text-white mt-1">16,900€</h3>
              <div className="flex items-center gap-1 text-green-400 text-sm mt-2">
                <TrendingUp size={16} />
                <span>+12.8%</span>
              </div>
            </div>
            <div className="p-2 bg-violet-600/20 rounded-lg">
              <DollarSign size={24} className="text-violet-400" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-violet-300">Items</p>
              <h3 className="text-2xl font-bold text-white mt-1">147</h3>
              <div className="flex items-center gap-1 text-violet-400 text-sm mt-2">
                <Package size={16} />
                <span>23 sealed</span>
              </div>
            </div>
            <div className="p-2 bg-violet-600/20 rounded-lg">
              <Package size={24} className="text-violet-400" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-violet-300">Meilleur ROI</p>
              <h3 className="text-2xl font-bold text-white mt-1">+324%</h3>
              <div className="flex items-center gap-1 text-green-400 text-sm mt-2">
                <TrendingUp size={16} />
                <span>Charizard PSA 10</span>
              </div>
            </div>
            <div className="p-2 bg-violet-600/20 rounded-lg">
              <TrendingUp size={24} className="text-violet-400" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-violet-300">Alertes Prix</p>
              <h3 className="text-2xl font-bold text-white mt-1">3</h3>
              <div className="flex items-center gap-1 text-yellow-400 text-sm mt-2">
                <AlertCircle size={16} />
                <span>Opportunités</span>
              </div>
            </div>
            <div className="p-2 bg-violet-600/20 rounded-lg">
              <AlertCircle size={24} className="text-violet-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et Recherche */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
            Tous
          </button>
          <button className="px-4 py-2 bg-violet-900/50 text-violet-300 rounded-lg hover:bg-violet-800/50 transition-colors">
            Sealed
          </button>
          <button className="px-4 py-2 bg-violet-900/50 text-violet-300 rounded-lg hover:bg-violet-800/50 transition-colors">
            Singles
          </button>
          <button className="px-4 py-2 bg-violet-900/50 text-violet-300 rounded-lg hover:bg-violet-800/50 transition-colors">
            Graded
          </button>
        </div>
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-400" />
          <input 
            type="text" 
            placeholder="Rechercher dans la collection..."
            className="pl-10 pr-4 py-2 bg-violet-900/20 border border-violet-800/50 rounded-lg text-white placeholder-violet-400 w-64"
          />
        </div>
      </div>

      {/* Grid de la Collection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-4 bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 hover:border-violet-600/50 transition-colors cursor-pointer">
            <img 
              src="/api/placeholder/200/200" 
              alt="Pokemon Card"
              className="w-full aspect-square object-cover rounded-lg mb-3 bg-violet-800/30"
            />
            <h3 className="font-medium text-white">Charizard VSTAR</h3>
            <p className="text-violet-300 text-sm mt-1">Brilliant Stars</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-white font-medium">89.99€</span>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <TrendingUp size={16} />
                <span>+5.2%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <button className="px-4 py-2 bg-violet-900/50 text-violet-300 rounded-lg hover:bg-violet-800/50 transition-colors">
          Précédent
        </button>
        <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
          1
        </button>
        <button className="px-4 py-2 bg-violet-900/50 text-violet-300 rounded-lg hover:bg-violet-800/50 transition-colors">
          2
        </button>
        <button className="px-4 py-2 bg-violet-900/50 text-violet-300 rounded-lg hover:bg-violet-800/50 transition-colors">
          3
        </button>
        <button className="px-4 py-2 bg-violet-900/50 text-violet-300 rounded-lg hover:bg-violet-800/50 transition-colors">
          Suivant
        </button>
      </div>
    </div>
  );
}