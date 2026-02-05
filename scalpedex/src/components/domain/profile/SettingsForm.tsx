// /src/features/profile/components/SettingsForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { ProfileSettings, UpdateSettingsData } from '@/types/profile.types';
import { useProfileSettings } from '@/hooks/useProfileSettings';

interface SettingsFormProps {
  initialSettings?: ProfileSettings | null;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const { settings, updateSettings, loading: settingsLoading } = useProfileSettings();
  const [formData, setFormData] = useState<UpdateSettingsData>({
    currency: 'EUR',
    language: 'fr',
    theme: 'DARK'
  });
  const [submitting, setSubmitting] = useState(false);
  
  // Initialiser le formulaire avec les paramètres actuels
  useEffect(() => {
    if (initialSettings || settings) {
      const currentSettings = initialSettings || settings;
      if (currentSettings) {
        setFormData({
          currency: currentSettings.currency,
          language: currentSettings.language,
          theme: currentSettings.theme
        });
      }
    }
  }, [initialSettings, settings]);
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationChange = (type: 'EMAIL' | 'PUSH' | 'INAPP', enabled: boolean) => {
    if (!settings) return;
    
    // Trouver l'index de la préférence de notification
    const index = settings.notifications.findIndex(notification => notification.type === type);
    if (index === -1) return;
    
    // Créer un tableau de mises à jour des notifications
    const notificationUpdates = [...settings.notifications];
    notificationUpdates[index] = {
      ...notificationUpdates[index],
      enabled
    };
    
    setFormData(prev => ({
      ...prev,
      notifications: notificationUpdates
    }));
  };
  
  const handleCategoryChange = (type: 'EMAIL' | 'PUSH' | 'INAPP', category: keyof ProfileSettings['notifications'][0]['categories'], enabled: boolean) => {
    if (!settings) return;
    
    // Trouver l'index de la préférence de notification
    const index = settings.notifications.findIndex(notification => notification.type === type);
    if (index === -1) return;
    
    // Créer un tableau de mises à jour des notifications
    const notificationUpdates = [...settings.notifications];
    notificationUpdates[index] = {
      ...notificationUpdates[index],
      categories: {
        ...notificationUpdates[index].categories,
        [category]: enabled
      }
    };
    
    setFormData(prev => ({
      ...prev,
      notifications: notificationUpdates
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await updateSettings(formData);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (settingsLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-violet-800/30 rounded-lg w-1/3" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-violet-800/30 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold text-white">Paramètres généraux</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-violet-300">Devise</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-black/30 border border-violet-800/50 rounded-lg text-white focus:outline-none focus:border-violet-500"
          >
            <option value="EUR">Euro (€)</option>
            <option value="USD">Dollar US ($)</option>
            <option value="GBP">Livre Sterling (£)</option>
            <option value="CAD">Dollar Canadien (C$)</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-violet-300">Langue</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-black/30 border border-violet-800/50 rounded-lg text-white focus:outline-none focus:border-violet-500"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-violet-300">Thème</label>
          <select
            name="theme"
            value={formData.theme}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-black/30 border border-violet-800/50 rounded-lg text-white focus:outline-none focus:border-violet-500"
          >
            <option value="DARK">Sombre</option>
            <option value="LIGHT">Clair</option>
            <option value="SYSTEM">Système</option>
          </select>
        </div>
      </div>
      
      {settings && (
        <>
          <h2 className="text-xl font-bold text-white pt-4">Notifications</h2>
          
          <div className="space-y-6">
            {settings.notifications.map((notification) => (
              <div key={notification.type} className="bg-violet-900/20 rounded-lg p-4 border border-violet-800/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-white">
                    {notification.type === 'EMAIL' ? 'Email' : 
                     notification.type === 'PUSH' ? 'Push' : 'Dans l\'app'}
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notification.enabled}
                      onChange={(e) => handleNotificationChange(notification.type, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-violet-800/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                  </label>
                </div>
                
                {notification.enabled && (
                  <div className="space-y-3 pl-2">
                    {Object.entries(notification.categories).map(([key, value]) => (
                      <div key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`${notification.type}-${key}`}
                          checked={value}
                          onChange={(e) => handleCategoryChange(
                            notification.type, 
                            key as keyof typeof notification.categories, 
                            e.target.checked
                          )}
                          className="w-4 h-4 text-violet-600 bg-violet-900/30 border-violet-800/50 rounded focus:ring-violet-500"
                        />
                        <label 
                          htmlFor={`${notification.type}-${key}`}
                          className="ml-2 text-sm text-violet-300"
                        >
                          {key === 'newDrop' ? 'Nouveaux drops' :
                           key === 'priceAlert' ? 'Alertes de prix' :
                           key === 'marketTrend' ? 'Tendances du marché' : 'Actualités'}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      
      <div className="pt-6">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save size={18} className="mr-2" />
              Enregistrer les paramètres
            </>
          )}
        </button>
      </div>
    </form>
  );
}