// /src/features/profile/components/ClientProfileView.tsx
'use client';

import React, { useState } from 'react';
import { ProfileHeader } from './ProfileHeader';
import { ProfileStats } from './ProfileStats';
import { ProfileActions } from './ProfileActions';
import { EditProfileForm } from './EditProfileForm';
import { useProfile } from '@/hooks/useProfile';
import { ProfileResponse } from '@/types/profile.types';

interface ClientProfileViewProps {
  initialData: ProfileResponse | null;
}

export function ClientProfileView({ initialData }: ClientProfileViewProps) {
  const { profile, stats, loading, error } = useProfile();
  const [showEditForm, setShowEditForm] = useState(false);
  
  // Utiliser les données initiales ou celles du hook
  const currentProfile = profile || initialData?.profile || null;
  const currentStats = stats || initialData?.stats || null;
  
  if (error) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-800/30 rounded-xl text-red-300">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <ProfileHeader 
        profile={currentProfile} 
        loading={loading} 
        onEdit={() => setShowEditForm(true)}
      />
      
      <ProfileStats stats={currentStats} loading={loading} />
      
      <ProfileActions />
      
      {showEditForm && currentProfile && (
        <EditProfileForm 
          profile={currentProfile} 
          onClose={() => setShowEditForm(false)}
        />
      )}
    </>
  );
}