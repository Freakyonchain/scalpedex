'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/app/actions/auth-actions';
import { AuthState } from '@/types/auth.types';

export function useSignIn() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: false,
    error: null
  });
  const router = useRouter();

  const handleSignIn = async (credentials: { email: string; password: string }) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const formData = new FormData();
      formData.append('email', credentials.email);
      formData.append('password', credentials.password);

      const result = await signIn(formData);

      if (!result.success) {
        setState(prev => ({ ...prev, loading: false, error: result.message }));
        return;
      }

      setState({ user: null, loading: false, error: null });
      router.push('/collection');
      router.refresh();
    } catch {
      setState(prev => ({ ...prev, loading: false, error: 'Une erreur est survenue lors de la connexion' }));
    }
  };

  return {
    ...state,
    signIn: handleSignIn
  };
}
