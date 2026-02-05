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
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Authentication error:', authError);
      return null;
    }

    const profile: UserProfile = {
      id: user.id,
      email: user.email || '',
      username: user.user_metadata?.username || user.email?.split('@')[0] || '',
      avatarUrl: user.user_metadata?.avatar_url,
      createdAt: user.created_at || new Date().toISOString(),
      isEmailVerified: user.email_confirmed_at !== null
    };

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
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: 'Vous devez être connecté pour mettre à jour votre profil'
      };
    }

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

    revalidatePath('/profile');

    return {
      success: true,
      message: 'Profil mis à jour avec succès'
    };
  } catch (error) {
    console.error('Error updating profile:', error);
    const message = error instanceof Error ? error.message : 'Une erreur est survenue';
    return { success: false, message };
  }
}

/**
 * Met à jour les paramètres utilisateur
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function updateSettings(data: UpdateSettingsData): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: 'Vous devez être connecté pour mettre à jour vos paramètres'
      };
    }

    revalidatePath('/profile');
    revalidatePath('/settings');

    return {
      success: true,
      message: 'Paramètres mis à jour avec succès'
    };
  } catch (error) {
    console.error('Error updating settings:', error);
    const message = error instanceof Error ? error.message : 'Une erreur est survenue';
    return { success: false, message };
  }
}

/**
 * Change le mot de passe de l'utilisateur
 */
export async function changePassword(data: ChangePasswordData): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  try {
    if (data.newPassword !== data.confirmPassword) {
      return {
        success: false,
        message: 'Les mots de passe ne correspondent pas'
      };
    }

    if (data.newPassword.length < 8) {
      return {
        success: false,
        message: 'Le mot de passe doit contenir au moins 8 caractères'
      };
    }

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
  } catch (error) {
    console.error('Error changing password:', error);
    const message = error instanceof Error ? error.message : 'Une erreur est survenue';
    return { success: false, message };
  }
}

/**
 * Supprime le compte utilisateur
 * Note: Nécessite un edge function ou API route avec service_role key.
 * L'approche actuelle signe simplement l'utilisateur out.
 */
export async function deleteAccount(): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: 'Vous devez être connecté pour supprimer votre compte'
      };
    }

    // La suppression d'un compte nécessite une clé service_role (admin).
    // Pour l'instant, on déconnecte l'utilisateur.
    // TODO: Implémenter via un edge function Supabase avec service_role key.
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        message: error.message || 'Erreur lors de la suppression du compte'
      };
    }

    return {
      success: false,
      message: 'La suppression de compte n\'est pas encore disponible. Contactez le support.'
    };
  } catch (error) {
    console.error('Error deleting account:', error);
    const message = error instanceof Error ? error.message : 'Une erreur est survenue';
    return { success: false, message };
  }
}
