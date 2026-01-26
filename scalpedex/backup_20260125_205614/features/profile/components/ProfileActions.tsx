// /src/features/profile/components/ProfileActions.tsx
'use client';

import React from 'react';
import { Settings, LogOut, Shield, Trash } from 'lucide-react';
import Link from 'next/link';
import { useProfile } from '../hooks/useProfile';

export function ProfileActions() {
  const { deleteAccount } = useProfile();
  
  const handleLogout = async () => {
    // Cette fonction serait normalement importée depuis le module d'authentification
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      // Redirection vers la page de déconnexion
      window.location.href = '/auth/sign-out';
    }
  };
  
  const handleDeleteAccount = async () => {
    await deleteAccount();
  };
  
  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">Actions</h2>
      
      <div className="space-y-3">
        <Link
          href="/settings"
          className="flex w-full items-center justify-between p-4 text-white hover:bg-violet-900/30 transition-colors rounded-lg bg-violet-900/20 border border-violet-800/30"
        >
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-violet-400" />
            <span>Paramètres</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
        
        <Link
          href="/privacy"
          className="flex w-full items-center justify-between p-4 text-white hover:bg-violet-900/30 transition-colors rounded-lg bg-violet-900/20 border border-violet-800/30"
        >
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-violet-400" />
            <span>Confidentialité et sécurité</span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
        
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-between p-4 text-white hover:bg-violet-900/30 transition-colors rounded-lg bg-violet-900/20 border border-violet-800/30"
        >
          <div className="flex items-center gap-3">
            <LogOut className="h-5 w-5 text-violet-400" />
            <span>Se déconnecter</span>
          </div>
        </button>
        
        <button
          onClick={handleDeleteAccount}
          className="flex w-full items-center justify-between p-4 text-red-300 hover:bg-red-900/30 transition-colors rounded-lg bg-red-900/10 border border-red-800/30"
        >
          <div className="flex items-center gap-3">
            <Trash className="h-5 w-5 text-red-400" />
            <span>Supprimer mon compte</span>
          </div>
        </button>
      </div>
    </div>
  );
}