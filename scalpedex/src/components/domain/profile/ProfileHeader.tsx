// /src/features/profile/components/ProfileHeader.tsx
'use client';

import React from 'react';
import { UserProfile } from '@/types/profile.types';
import { User, Edit } from 'lucide-react';

interface ProfileHeaderProps {
  profile: UserProfile | null;
  loading?: boolean;
  onEdit?: () => void;
}

export function ProfileHeader({ profile, loading = false, onEdit }: ProfileHeaderProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-violet-800/30 bg-violet-900/20 p-6 backdrop-blur-sm animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-violet-800/50" />
            <div className="flex flex-col gap-2">
              <div className="h-6 w-40 bg-violet-800/50 rounded" />
              <div className="h-4 w-32 bg-violet-800/50 rounded" />
            </div>
          </div>
          <div className="h-8 w-8 bg-violet-800/50 rounded-full" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-xl border border-violet-800/30 bg-violet-900/20 p-6 backdrop-blur-sm">
        <p className="text-violet-300">Impossible de charger le profil</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-violet-800/30 bg-violet-900/20 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-600">
            {profile.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt={profile.username || 'Avatar'} 
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-white" />
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-medium text-white">
              {profile.username || profile.email?.split('@')[0] || 'Utilisateur'}
            </h1>
            <p className="text-sm text-violet-300">
              {profile.email}
              {profile.isEmailVerified && (
                <span className="ml-2 text-green-400">✓ Vérifié</span>
              )}
            </p>
          </div>
        </div>
        {onEdit && (
          <button 
            onClick={onEdit}
            className="p-2 rounded-full hover:bg-violet-900/30 transition-colors"
            aria-label="Modifier le profil"
          >
            <Edit className="h-5 w-5 text-violet-400" />
          </button>
        )}
      </div>
    </div>
  );
}