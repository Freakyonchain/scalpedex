// /src/features/auth/components/VerifyEmailView.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mail, RefreshCw, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { resendVerificationEmail } from '../server-actions/auth-actions';

export function VerifyEmailView() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleResendEmail = async () => {
    if (!email) {
      setError("Adresse email manquante");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await resendVerificationEmail(email);
      
      if (result.success) {
        setSuccess(result.message || "Email renvoyé avec succès");
        setCanResend(false);
        setCountdown(60);
      } else {
        setError(result.error || "Erreur lors du renvoi de l'email");
      }
    } catch (error) {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Icon et message */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-3 bg-violet-500/20 rounded-full">
          <Mail className="h-8 w-8 text-violet-400" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-white">
            Nous avons envoyé un email de confirmation à
          </p>
          <p className="font-medium text-violet-300">
            {email || "votre adresse email"}
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

      {/* Instructions */}
      <div className="text-violet-300 text-sm space-y-2">
        <p>Pour compléter votre inscription :</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Vérifiez votre boîte de réception</li>
          <li>Cliquez sur le lien de confirmation dans l'email</li>
          <li>Connectez-vous à votre compte</li>
        </ol>
      </div>

      {/* Bouton de renvoi */}
      <button
        onClick={handleResendEmail}
        disabled={!canResend || loading}
        className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center
          ${canResend 
            ? 'bg-violet-600 hover:bg-violet-500 text-white' 
            : 'bg-violet-900/50 text-violet-400 cursor-not-allowed'}`}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <RefreshCw className={`mr-2 h-5 w-5 ${!canResend && countdown > 0 && 'animate-spin'}`} />
            {canResend 
              ? "Renvoyer l'email" 
              : `Renvoyer dans ${countdown} secondes`}
          </>
        )}
      </button>
    </div>
  );
}