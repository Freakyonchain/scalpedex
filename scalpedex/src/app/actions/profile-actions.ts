// /src/features/profile/server-actions/profile-actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { 
  UserProfile, 
  ProfileStats, 
  ProfileSettings,
  ProfileResponse,
  UpdateProfileData,
  UpdateSettingsData,
  ChangePasswordData
} from '@/types/profile.types';
import { revalidatePath } from 'next/cache';

/**
 * Récupère les données complètes du profil utilisateur
 */
export async function getProfileData(): Promise<ProfileResponse | null> {
  const supabase = await createClient();
  
  try {
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return null;
    }
    
    // Récupérer le profil utilisateur
    const profile: UserProfile = {
      id: user.id,
      email: user.email || '',
      username: user.user_metadata?.username || user.email?.split('@')[0] || '',
      avatarUrl: user.user_metadata?.avatar_url,
      createdAt: user.created_at || new Date().toISOString(),
      isEmailVerified: user.email_confirmed_at !== null
    };
    
    // Récupérer les statistiques
    // Dans une implémentation réelle, nous utiliserions une requête vers la base de données
    const stats: ProfileStats = {
      totalItems: 46,
      totalValue: 3249.75,
      memberSince: new Date(user.created_at || Date.now()).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric'
      }),
      avgPurchasePrice: 70.65,
      numSoldItems: 12,
      bestRoi: 87.5
    };
    
    // Récupérer les paramètres
    // Dans une implémentation réelle, nous utiliserions une requête vers la base de données
    const settings: ProfileSettings = {
      currency: 'EUR',
      language: 'fr',
      theme: 'DARK',
      notifications: [
        {
          type: 'EMAIL',
          enabled: true,
          categories: {
            newDrop: true,
            priceAlert: true,
            marketTrend: false,
            news: false
          }
        },
        {
          type: 'PUSH',
          enabled: true,
          categories: {
            newDrop: true,
            priceAlert: true,
            marketTrend: true,
            news: true
          }
        },
        {
          type: 'INAPP',
          enabled: true,
          categories: {
            newDrop: true,
            priceAlert: true,
            marketTrend: true,
            news: true
          }
        }
      ]
    };
    
    return {
      profile,
      stats,
      settings
    };
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return null;
  }
}

/**
 * Met à jour les informations du profil
 */
export async function updateProfile(data: UpdateProfileData): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();
  
  try {
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        message: 'Vous devez être connecté pour mettre à jour votre profil'
      };
    }
    
    // Mettre à jour les métadonnées utilisateur
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        username: data.username,
        avatar_url: data.avatarUrl
      }
    });
    
    if (updateError) {
      return {
        success: false,
        message: updateError.message || 'Erreur lors de la mise à jour du profil'
      };
    }
    
    // Revalider le profil
    revalidatePath('/profile');
    
    return {
      success: true,
      message: 'Profil mis à jour avec succès'
    };
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return {
      success: false,
      message: error.message || 'Une erreur est survenue'
    };
  }
}

/**
 * Met à jour les paramètres utilisateur
 */
export async function updateSettings(data: UpdateSettingsData): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();
  
  try {
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        message: 'Vous devez être connecté pour mettre à jour vos paramètres'
      };
    }
    
    // Dans une implémentation réelle, nous utiliserions une requête UPDATE vers la base de données
    // Ici, nous simulons simplement le succès de l'opération
    
    // Revalider le profil
    revalidatePath('/profile');
    revalidatePath('/settings');
    
    return {
      success: true,
      message: 'Paramètres mis à jour avec succès'
    };
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return {
      success: false,
      message: error.message || 'Une erreur est survenue'
    };
  }
}

/**
 * Change le mot de passe de l'utilisateur
 */
export async function changePassword(data: ChangePasswordData): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();
  
  try {
    // Vérifier que les mots de passe correspondent
    if (data.newPassword !== data.confirmPassword) {
      return {
        success: false,
        message: 'Les mots de passe ne correspondent pas'
      };
    }
    
    // Vérifier que le mot de passe est assez fort
    if (data.newPassword.length < 8) {
      return {
        success: false,
        message: 'Le mot de passe doit contenir au moins 8 caractères'
      };
    }
    
    // Changer le mot de passe
    const { error } = await supabase.auth.updateUser({
      password: data.newPassword
    });
    
    if (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors du changement de mot de passe'
      };
    }
    
    return {
      success: true,
      message: 'Mot de passe mis à jour avec succès'
    };
  } catch (error: any) {
    console.error('Error changing password:', error);
    return {
      success: false,
      message: error.message || 'Une erreur est survenue'
    };
  }
}

/**
 * Supprime le compte utilisateur
 */
export async function deleteAccount(): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();
  
  try {
    // Dans une implémentation réelle, nous devrions :
    // 1. Supprimer toutes les données associées à l'utilisateur
    // 2. Supprimer l'utilisateur lui-même
    
    const { error } = await supabase.auth.admin.deleteUser(
      (await supabase.auth.getUser()).data.user?.id || ''
    );
    
    if (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors de la suppression du compte'
      };
    }
    
    return {
      success: true,
      message: 'Compte supprimé avec succès'
    };
  } catch (error: any) {
    console.error('Error deleting account:', error);
    return {
      success: false,
      message: error.message || 'Une erreur est survenue'
    };
  }
}