// /src/features/auth/hooks/useResetPassword.ts
'use client';

import { useState } from 'react';
import { requestPasswordReset, setNewPassword } from '../server-actions/auth-actions';
import { ResetPasswordData, NewPasswordData } from '../types/auth-types';

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const requestReset = async (data: ResetPasswordData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await requestPasswordReset(data);
      
      if (!result.success) {
        setError(result.error);
      } else {
        setSuccess(result.message || 'Email de réinitialisation envoyé');
      }
    } catch (error) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data: NewPasswordData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await setNewPassword(data);
      
      if (!result.success) {
        setError(result.error);
      } else {
        setSuccess(result.message || 'Mot de passe mis à jour avec succès');
      }
    } catch (error) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    requestReset,
    resetPassword
  };
}