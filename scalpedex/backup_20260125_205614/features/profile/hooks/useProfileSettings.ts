// /src/features/profile/hooks/useProfileSettings.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProfileData, updateSettings } from '../server-actions/profile-actions';
import { ProfileSettings, UpdateSettingsData } from '../types/profile-types';
import { toast } from 'sonner';

export function useProfileSettings() {
  const [settings, setSettings] = useState<ProfileSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Charger les paramètres
  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getProfileData();
      
      if (!data) {
        setError('Impossible de charger les paramètres');
        return;
      }
      
      setSettings(data.settings);
    } catch (err) {
      setError('Erreur lors du chargement des paramètres');
      console.error('Settings load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Mettre à jour les paramètres
  const updateUserSettings = async (data: UpdateSettingsData) => {
    try {
      const result = await updateSettings(data);
      
      if (result.success) {
        // Mettre à jour les données locales
        if (settings) {
          setSettings({
            ...settings,
            currency: data.currency || settings.currency,
            language: data.language || settings.language,
            theme: data.theme || settings.theme,
            notifications: data.notifications 
              ? settings.notifications.map((notification, index) => ({
                  ...notification,
                  ...(data.notifications && data.notifications[index] ? data.notifications[index] : {})
                }))
              : settings.notifications
          });
        }
        
        toast.success(result.message);
        return true;
      } else {
        toast.error(result.message);
        return false;
      }
    } catch (err) {
      toast.error('Erreur lors de la mise à jour des paramètres');
      console.error('Settings update error:', err);
      return false;
    }
  };
  
  // Charger les paramètres au chargement
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);
  
  return {
    settings,
    loading,
    error,
    updateSettings: updateUserSettings,
    refreshSettings: loadSettings
  };
}