// /src/features/auth/hooks/useSignUp.ts
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/app/actions/auth-actions';
import { SignUpData, AuthState } from '@/types/auth.types';

export function useSignUp() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: false,
    error: null
  });
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (data: SignUpData) => {
    setState({ ...state, loading: true, error: null });
    setSuccess(null);
    
    try {
      const result = await signUp(data);
      
      if (!result.success) {
        setState({ ...state, loading: false, error: result.error });
        return;
      }
      
      setState({ user: result.user || null, loading: false, error: null });
      setSuccess(result.message || 'Inscription réussie! Vérifiez votre email.');
      
      // Redirection vers la page de vérification email
      router.push('/auth/verify-email?email=' + encodeURIComponent(data.email));
    } catch (error) {
      setState({ ...state, loading: false, error: 'Une erreur est survenue lors de l\'inscription' });
    }
  };

  return {
    ...state,
    success,
    signUp: handleSignUp
  };
}