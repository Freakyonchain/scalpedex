'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/app/actions/auth-actions';
import { AuthState } from '@/types/auth.types';

export function useSignUp() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: false,
    error: null
  });
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (data: { email: string; password: string; username?: string }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      if (data.username) {
        formData.append('username', data.username);
      }

      const result = await signUp(formData);

      if (!result.success) {
        setState(prev => ({ ...prev, loading: false, error: result.message }));
        return;
      }

      setState({ user: null, loading: false, error: null });
      setSuccess(result.message || 'Inscription reussie! Verifiez votre email.');

      router.push('/auth/verify-email?email=' + encodeURIComponent(data.email));
    } catch {
      setState(prev => ({ ...prev, loading: false, error: 'Une erreur est survenue lors de l\'inscription' }));
    }
  };

  return {
    ...state,
    success,
    signUp: handleSignUp
  };
}
