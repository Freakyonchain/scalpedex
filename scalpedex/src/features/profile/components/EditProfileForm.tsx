// /src/features/profile/components/EditProfileForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { UserProfile, UpdateProfileData } from '../types/profile-types';
import { useProfile } from '../hooks/useProfile';

interface EditProfileFormProps {
  profile: UserProfile;
  onClose: () => void;
}

export function EditProfileForm({ profile, onClose }: EditProfileFormProps) {
  const { updateProfile } = useProfile();
  const [formData, setFormData] = useState<UpdateProfileData>({
    username: '',
    avatarUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  // Initialiser le formulaire avec les données actuelles
  useEffect(() => {
    setFormData({
      username: profile.username || '',
      avatarUrl: profile.avatarUrl || ''
    });
  }, [profile]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const success = await updateProfile(formData);
      if (success) {
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-violet-900/95 rounded-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-violet-300 hover:text-white"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-xl font-bold text-white mb-6">Modifier mon profil</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-violet-300">Nom d'utilisateur</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-black/30 border border-violet-800/50 rounded-lg text-white focus:outline-none focus:border-violet-500"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-violet-300">URL de l'avatar</label>
            <input
              type="text"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-black/30 border border-violet-800/50 rounded-lg text-white focus:outline-none focus:border-violet-500"
              placeholder="https://exemple.com/avatar.jpg"
            />
            {formData.avatarUrl && (
              <div className="mt-2 flex justify-center">
                <img 
                  src={formData.avatarUrl} 
                  alt="Aperçu de l'avatar" 
                  className="h-20 w-20 rounded-full object-cover border-2 border-violet-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
                  }}
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-violet-900/50 text-violet-300 rounded-lg hover:bg-violet-800/50 transition-colors"
            >
              Annuler
            </button>
            
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}