// /src/app/settings/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProfileData } from '@/app/actions/profile-actions';
import { SettingsForm } from '@/components/domain/profile/SettingsForm';

// Forcer le rendu dynamique
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function SettingsLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-violet-900/20 rounded w-40" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-violet-900/20 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default async function SettingsPage() {
  // Récupérer les paramètres pour SSR
  const profileData = await getProfileData();
  
  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-b from-violet-950 to-black">
      <Link 
        href="/profile" 
        className="inline-flex items-center text-violet-400 hover:text-violet-300 transition-colors"
      >
        <ArrowLeft size={20} className="mr-1" /> Retour au profil
      </Link>
      
      <h1 className="text-3xl font-bold text-white mb-6">Paramètres</h1>
      
      <div className="max-w-2xl">
        <Suspense fallback={<SettingsLoading />}>
          <SettingsForm initialSettings={profileData?.settings} />
        </Suspense>
      </div>
    </div>
  );
}