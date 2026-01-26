// /src/features/auth/server-actions/auth-actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { SignInCredentials, SignUpData, ResetPasswordData, NewPasswordData, AuthResponse } from '@/types/auth.types';
import { validateSignUpData } from '@/lib/utils/auth-validators';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Action serveur pour la connexion
 */
export async function signIn(credentials: SignInCredentials): Promise<AuthResponse> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });

    if (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }

    return { 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email || '',
        createdAt: data.user.created_at
      } 
    };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: 'Une erreur est survenue lors de la connexion' 
    };
  }
}

/**
 * Action serveur pour l'inscription
 */
export async function signUp(userData: SignUpData): Promise<AuthResponse> {
  const supabase = createClient();
  
  // Validation des données
  const validation = validateSignUpData(userData);
  if (!validation.valid) {
    return { 
      success: false, 
      error: validation.error 
    };
  }
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
      }
    });

    if (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }

    return { 
      success: true, 
      user: data.user,
      message: 'Vérifiez votre email pour confirmer votre inscription'
    };
  } catch (error) {
    console.error('Signup error:', error);
    return { 
      success: false, 
      error: 'Une erreur est survenue lors de l\'inscription' 
    };
  }
}

/**
 * Action serveur pour la déconnexion
 */
export async function signOut(): Promise<void> {
  const supabase = createClient();
  
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  redirect('/auth/sign-in');
}

/**
 * Action serveur pour la réinitialisation du mot de passe
 */
export async function requestPasswordReset(data: ResetPasswordData): Promise<AuthResponse> {
  const supabase = createClient();
  
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
    });

    if (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }

    return { 
      success: true, 
      message: 'Un email de réinitialisation a été envoyé'
    };
  } catch (error) {
    console.error('Password reset request error:', error);
    return { 
      success: false, 
      error: 'Une erreur est survenue lors de la demande de réinitialisation' 
    };
  }
}

/**
 * Action serveur pour définir un nouveau mot de passe
 */
export async function setNewPassword(data: NewPasswordData): Promise<AuthResponse> {
  const supabase = createClient();
  
  // Validation
  if (data.password !== data.confirmPassword) {
    return {
      success: false,
      error: 'Les mots de passe ne correspondent pas'
    };
  }
  
  try {
    const { error } = await supabase.auth.updateUser({
      password: data.password
    });

    if (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }

    return { 
      success: true, 
      message: 'Mot de passe mis à jour avec succès'
    };
  } catch (error) {
    console.error('Set new password error:', error);
    return { 
      success: false, 
      error: 'Une erreur est survenue lors de la réinitialisation du mot de passe' 
    };
  }
}

/**
 * Action serveur pour le renvoi de l'email de vérification
 */
export async function resendVerificationEmail(email: string): Promise<AuthResponse> {
  const supabase = createClient();
  
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
      }
    });

    if (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }

    return { 
      success: true, 
      message: 'Email de vérification renvoyé'
    };
  } catch (error) {
    console.error('Resend verification email error:', error);
    return { 
      success: false, 
      error: 'Une erreur est survenue lors du renvoi de l\'email' 
    };
  }
}

/**
 * Action serveur pour obtenir la session utilisateur
 */
export async function getUserSession() {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      return { success: false, user: null };
    }
    
    return { 
      success: true, 
      user: {
        id: data.session.user.id,
        email: data.session.user.email || '',
        createdAt: data.session.user.created_at
      }
    };
  } catch (error) {
    console.error('Get user session error:', error);
    return { success: false, user: null };
  }
}