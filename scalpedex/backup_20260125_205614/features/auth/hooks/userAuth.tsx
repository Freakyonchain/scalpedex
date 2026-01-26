// /src/features/auth/hooks/useAuth.ts
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp, signOut } from '../server-actions/auth-actions';
import { SignInCredentials, SignUpData, AuthState } from '../types/auth-types';

export function useSignIn() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: false,
    error: null
  });
  const router = useRouter();

  const handleSignIn = async (credentials: SignInCredentials) => {
    setState({ ...state, loading: true, error: null });
    
    try {
      const result = await signIn(credentials);
      
      if (!result.success) {
        setState({ ...state, loading: false, error: result.error });
        return;
      }
      
      setState({ user: result.user, loading: false, error: null });
      router.push('/collection');
      router.refresh();
    } catch (error) {
      setState({ ...state, loading: false, error: 'Une erreur est survenue lors de la connexion' });
    }
  };

  return {
    ...state,
    signIn: handleSignIn
  };
}

export function useSignUp() {
  // Similar implementation to useSignIn
}