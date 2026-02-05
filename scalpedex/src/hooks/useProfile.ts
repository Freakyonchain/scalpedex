// /src/features/profile/hooks/useProfile.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  getProfileData, 
  updateProfile,
  changePassword,
  deleteAccount
} from '@/app/actions/profile-actions';
import {
  UserProfile,
  ProfileStats,
  UpdateProfileData,
  ChangePasswordData
} from '@/types/profile.types';
import { toast } from 'sonner';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Charger les données du profil
  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getProfileData();
      
      if (!data) {
        setError('Impossible de charger les données du profil');
        return;
      }
      
      setProfile(data.profile);
      setStats(data.stats);
    } catch (err) {
      setError('Erreur lors du chargement du profil');
      console.error('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Mettre à jour le profil
  const updateUserProfile = async (data: UpdateProfileData) => {
    try {
      const result = await updateProfile(data);
      
      if (result.success) {
        // Mettre à jour les données locales
        if (profile) {
          setProfile({
            ...profile,
            username: data.username || profile.username,
            avatarUrl: data.avatarUrl || profile.avatarUrl
          });
        }
        
        toast.success(result.message);
        return true;
      } else {
        toast.error(result.message);
        return false;
      }
    } catch (err) {
      toast.error('Erreur lors de la mise à jour du profil');
      console.error('Profile update error:', err);
      return false;
    }
  };
  
  // Changer le mot de passe
  const changeUserPassword = async (data: ChangePasswordData) => {
    try {
      const result = await changePassword(data);
      
      if (result.success) {
        toast.success(result.message);
        return true;
      } else {
        toast.error(result.message);
        return false;
      }
    } catch (err) {
      toast.error('Erreur lors du changement de mot de passe');
      console.error('Password change error:', err);
      return false;
    }
  };
  
  // Supprimer le compte
  const deleteUserAccount = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      return false;
    }
    
    try {
      const result = await deleteAccount();
      
      if (result.success) {
        toast.success(result.message);
        // Redirection vers la page d'accueil ou de connexion
        window.location.href = '/auth/sign-in';
        return true;
      } else {
        toast.error(result.message);
        return false;
      }
    } catch (err) {
      toast.error('Erreur lors de la suppression du compte');
      console.error('Account deletion error:', err);
      return false;
    }
  };
  
  // Charger les données au chargement
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);
  
  return {
    profile,
    stats,
    loading,
    error,
    updateProfile: updateUserProfile,
    changePassword: changeUserPassword,
    deleteAccount: deleteUserAccount,
    refreshProfile: loadProfile
  };
}