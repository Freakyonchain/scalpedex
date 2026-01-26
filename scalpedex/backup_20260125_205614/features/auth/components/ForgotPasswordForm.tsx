// /src/features/auth/components/ForgotPasswordForm.tsx
'use client';

import { useState } from 'react';
import { Loader2, Mail } from 'lucide-react';
import { useResetPassword } from '../hooks/useResetPassword';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const { loading, error, success, requestReset } = useResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestReset({ email });
  };

  return (
    <div className="space-y-6">
      {/* Icon et message */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-3 bg-violet-500/20 rounded-full">
          <Mail className="h-8 w-8 text-violet-400" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-white">Mot de passe oublié</h3>
          <p className="text-sm text-violet-300 mt-1">
            Saisissez votre adresse email pour recevoir un lien de réinitialisation
          </p>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-900/30 border border-red-800/30 rounded-lg p-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Message de succès */}
      {success && (
        <div className="bg-green-900/30 border border-green-800/30 rounded-lg p-3 text-green-300 text-sm">
          {success}
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse email"
            className="w-full px-3 py-2 bg-black/20 border border-violet-800/30 rounded-lg text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            required
            autoComplete="email"
            autoFocus
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || !email}
          className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            "Envoyer le lien de réinitialisation"
          )}
        </button>
      </form>
    </div>
  );
}