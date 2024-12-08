// app/profile/page.tsx
'use client';

import React, { useState } from 'react';
import { Settings, User, Bell, Globe, Wallet, MessageCircle, ExternalLink, Copy, Shield, Eye, EyeOff, ChevronRight } from 'lucide-react';

type ConfigSection = 'profile' | 'preferences' | 'privacy' | 'connections';

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState<ConfigSection>('profile');
  const [showPrivateStats, setShowPrivateStats] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Profil Header */}
      <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">MB</span>
            </div>
            <div className="absolute inset-0 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              Modifier
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">MrBeast</h1>
              <button className="p-1 text-violet-400 hover:text-violet-300 transition-colors">
                <Copy size={16} />
              </button>
            </div>
            <p className="text-violet-300">Paris, France</p>
            <div className="flex items-center gap-3 mt-2">
              <a 
                href="#" 
                className="text-sm text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
              >
                <MessageCircle size={16} />
                Discord
              </a>
              <a 
                href="#" 
                className="text-sm text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
              >
                <ExternalLink size={16} />
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-2">
          {[
            { id: 'profile', label: 'Profil', icon: User },
            { id: 'preferences', label: 'Préférences', icon: Settings },
            { id: 'privacy', label: 'Confidentialité', icon: Shield },
            { id: 'connections', label: 'Connexions', icon: Globe },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as ConfigSection)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                activeSection === item.id 
                  ? 'bg-violet-600 text-white' 
                  : 'text-violet-300 hover:bg-violet-900/20'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Contenu Principal */}
        <div className="md:col-span-3 space-y-6">
          {/* Stats Privées */}
          <div className="bg-violet-900/20 backdrop-blur-sm rounded-xl border border-violet-800/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-white">Stats Privées</h2>
              <button 
                onClick={() => setShowPrivateStats(!showPrivateStats)}
                className="text-violet-400 hover:text-violet-300 transition-colors"
              >
                {showPrivateStats ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {showPrivateStats ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-black/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet size={20} className="text-violet-400" />
                    <span className="text-violet-300">Investissement Total</span>
                  </div>
                  <p className="text-2xl font-bold text-white">4,721€</p>
                </div>
                {/* Autres stats... */}
              </div>
            ) : (
              <div className="text-center py-8 text-violet-300">
                Cliquez sur l'œil pour afficher vos stats privées
              </div>
            )}
          </div>

          {/* Paramètres de la Section Active */}
          <div className="space-y-4">
            {activeSection === 'preferences' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-4 bg-violet-900/20 backdrop-blur-sm rounded-lg border border-violet-800/50">
                  <div>
                    <h3 className="text-white font-medium">Devise par défaut</h3>
                    <p className="text-sm text-violet-300">Pour l'affichage des prix</p>
                  </div>
                  <select className="bg-black/20 border border-violet-800/50 rounded-lg px-3 py-2 text-white">
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-violet-900/20 backdrop-blur-sm rounded-lg border border-violet-800/50">
                  <div>
                    <h3 className="text-white font-medium">Notifications</h3>
                    <p className="text-sm text-violet-300">Alertes de prix et nouveautés</p>
                  </div>
                  <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                    Configurer
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'connections' && (
              <div className="space-y-2">
                {['Discord', 'Instagram', 'eBay', 'TCGPlayer'].map((platform) => (
                  <div key={platform} className="flex items-center justify-between p-4 bg-violet-900/20 backdrop-blur-sm rounded-lg border border-violet-800/50">
                    <div className="flex items-center gap-3">
                      <Globe className="text-violet-400" size={24} />
                      <div>
                        <h3 className="text-white font-medium">{platform}</h3>
                        <p className="text-sm text-violet-300">Non connecté</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                      Connecter
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}