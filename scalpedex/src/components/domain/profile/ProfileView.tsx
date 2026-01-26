// /src/features/profile/components/ProfileView.tsx
import React from 'react';
import { Suspense } from 'react';
import { getProfileData } from '@/app/actions/profile-actions';
import { ClientProfileView } from './ClientProfileView';

function ProfileLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-24 bg-violet-900/20 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-violet-900/20 rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-violet-900/20 rounded-xl" />
    </div>
  );
}

export default async function ProfileView() {
  // Récupérer les données du profil côté serveur pour SSR
  const profileData = await getProfileData();

  return (
    <div className="space-y-6">
      <Suspense fallback={<ProfileLoading />}>
        <ClientProfileView initialData={profileData} />
      </Suspense>
    </div>
  );
}