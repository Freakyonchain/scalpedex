'use client';

import { useState } from 'react';
import { requestPasswordReset, setNewPassword } from '@/app/actions/auth-actions';

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const requestReset = async (data: { email: string }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await requestPasswordReset(data);

      if (!result.success) {
        setError(result.message);
      } else {
        setSuccess(result.message || 'Email de réinitialisation envoyé');
      }
    } catch {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data: { password: string; confirmPassword: string; token: string }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await setNewPassword(data);

      if (!result.success) {
        setError(result.message);
      } else {
        setSuccess(result.message || 'Mot de passe mis à jour avec succès');
      }
    } catch {
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
