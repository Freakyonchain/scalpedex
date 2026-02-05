'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { useResetPassword } from '@/hooks/useResetPassword';
import { useRouter, useSearchParams } from 'next/navigation';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const router = useRouter();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { loading, error, success, resetPassword } = useResetPassword();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await resetPassword({
      ...formData,
      token
    });

    if (success) {
      setTimeout(() => {
        router.push('/auth/sign-in');
      }, 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Icon et message */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-3 bg-violet-500/20 rounded-full">
          <Lock className="h-8 w-8 text-violet-400" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-white">Reinitialiser votre mot de passe</h3>
          <p className="text-sm text-violet-300 mt-1">
            Veuillez choisir un nouveau mot de passe securise
          </p>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-900/30 border border-red-800/30 rounded-lg p-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Message de succes */}
      {success && (
        <div className="bg-green-900/30 border border-green-800/30 rounded-lg p-3 text-green-300 text-sm">
          {success}
          <p className="mt-1">Redirection vers la page de connexion...</p>
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2 relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Nouveau mot de passe"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-black/20 border border-violet-800/30 rounded-lg text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500 pr-10"
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="space-y-2 relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirmer le mot de passe"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-black/20 border border-violet-800/30 rounded-lg text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500 pr-10"
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-400"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.password || !formData.confirmPassword}
          className="w-full py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Reinitialisation...
            </>
          ) : (
            'Reinitialiser le mot de passe'
          )}
        </button>
      </form>
    </div>
  );
}
