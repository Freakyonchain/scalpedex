'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ============================================================================
// TYPES
// ============================================================================

export type ActionResult<T = void> = {
  success: true;
  data?: T;
  message?: string;
} | {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
};

// ============================================================================
// SCHEMAS (Zod Validation)
// ============================================================================

const emailSchema = z.string().email('Email invalide');

const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre');

const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: z
    .string()
    .min(3, 'Le pseudo doit contenir au moins 3 caractères')
    .max(20, 'Le pseudo ne doit pas dépasser 20 caractères')
    .regex(/^[a-zA-Z0-9_]+$/, 'Le pseudo ne peut contenir que des lettres, chiffres et underscores'),
});

const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Le mot de passe est requis'),
});

const resetPasswordSchema = z.object({
  email: emailSchema,
});

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Sign up a new user
 * Creates auth user + profile entry (via Supabase trigger)
 */
export async function signUp(formData: FormData): Promise<ActionResult> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
    username: formData.get('username'),
  };

  // Validate input
  const validation = signUpSchema.safeParse(rawData);
  
  if (!validation.success) {
    return {
      success: false,
      message: 'Données invalides',
      errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { email, password, username } = validation.data;

  try {
    const supabase = await createClient();

    // Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      console.error('[signUp] Auth error:', error.message);
      
      if (error.message.includes('already registered')) {
        return { success: false, message: 'Cet email est déjà utilisé' };
      }
      
      return { success: false, message: 'Erreur lors de l\'inscription' };
    }

    if (!data.user) {
      return { success: false, message: 'Erreur lors de la création du compte' };
    }

    // Update profile with username
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ username })
      .eq('id', data.user.id);

    if (profileError) {
      console.error('[signUp] Profile update error:', profileError.message);
    }

    // Check if email confirmation is required
    if (data.user.identities?.length === 0) {
      return { 
        success: true, 
        message: 'Vérifiez votre email pour confirmer votre compte' 
      };
    }

    revalidatePath('/', 'layout');
    
    return { success: true, message: 'Compte créé avec succès!' };

  } catch (error) {
    console.error('[signUp] Unexpected error:', error);
    return { success: false, message: 'Une erreur inattendue s\'est produite' };
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(formData: FormData): Promise<ActionResult> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  // Validate input
  const validation = signInSchema.safeParse(rawData);
  
  if (!validation.success) {
    return {
      success: false,
      message: 'Données invalides',
      errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { email, password } = validation.data;

  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[signIn] Auth error:', error.message);
      
      if (error.message.includes('Invalid login credentials')) {
        return { success: false, message: 'Email ou mot de passe incorrect' };
      }
      
      if (error.message.includes('Email not confirmed')) {
        return { success: false, message: 'Veuillez confirmer votre email' };
      }
      
      return { success: false, message: 'Erreur de connexion' };
    }

    if (!data.user) {
      return { success: false, message: 'Utilisateur non trouvé' };
    }

    // Update streak
    await supabase
      .from('profiles')
      .update({ 
        last_active_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.user.id);

    revalidatePath('/', 'layout');
    
    return { success: true, message: 'Connexion réussie!' };

  } catch (error) {
    console.error('[signIn] Unexpected error:', error);
    return { success: false, message: 'Une erreur inattendue s\'est produite' };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('[signOut] Error:', error.message);
      return { success: false, message: 'Erreur lors de la déconnexion' };
    }

    revalidatePath('/', 'layout');
    
    return { success: true, message: 'Déconnexion réussie' };

  } catch (error) {
    console.error('[signOut] Unexpected error:', error);
    return { success: false, message: 'Une erreur inattendue s\'est produite' };
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(formData: FormData): Promise<ActionResult> {
  const rawData = {
    email: formData.get('email'),
  };

  const validation = resetPasswordSchema.safeParse(rawData);
  
  if (!validation.success) {
    return {
      success: false,
      message: 'Email invalide',
      errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { email } = validation.data;

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
      console.error('[resetPassword] Error:', error.message);
    }

    // Always return success to not reveal if email exists
    return { 
      success: true, 
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé' 
    };

  } catch (error) {
    console.error('[resetPassword] Unexpected error:', error);
    return { success: false, message: 'Une erreur inattendue s\'est produite' };
  }
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(email: string): Promise<ActionResult> {
  if (!email) {
    return { success: false, message: 'Email requis' };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      console.error('[resendVerificationEmail] Error:', error.message);
    }

    // Always return success to not reveal if email exists
    return {
      success: true,
      message: 'Si cet email existe, un email de vérification a été renvoyé',
    };

  } catch (error) {
    console.error('[resendVerificationEmail] Unexpected error:', error);
    return { success: false, message: 'Une erreur inattendue s\'est produite' };
  }
}

/**
 * Get current authenticated user session
 */
export async function getUserSession() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return { user: null };
    }

    return { user };
  } catch {
    return { user: null };
  }
}

/**
 * Set a new password (after reset token)
 */
export async function setNewPassword(data: {
  password: string;
  confirmPassword: string;
  token: string;
}): Promise<ActionResult> {
  if (data.password !== data.confirmPassword) {
    return { success: false, message: 'Les mots de passe ne correspondent pas' };
  }

  const passwordValidation = passwordSchema.safeParse(data.password);
  if (!passwordValidation.success) {
    return {
      success: false,
      message: passwordValidation.error.issues[0]?.message || 'Mot de passe invalide',
    };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      console.error('[setNewPassword] Error:', error.message);
      return { success: false, message: 'Erreur lors de la mise à jour du mot de passe' };
    }

    return { success: true, message: 'Mot de passe mis à jour avec succès' };
  } catch (error) {
    console.error('[setNewPassword] Unexpected error:', error);
    return { success: false, message: 'Une erreur inattendue s\'est produite' };
  }
}

/**
 * Request password reset (alias for resetPassword with object input)
 */
export async function requestPasswordReset(data: { email: string }): Promise<ActionResult> {
  const formData = new FormData();
  formData.append('email', data.email);
  return resetPassword(formData);
}

/**
 * Get current authenticated user with profile data
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return null;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return { user, profile };

  } catch (error) {
    console.error('[getCurrentUser] Unexpected error:', error);
    return null;
  }
}