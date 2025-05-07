// /src/app/auth/verify-email/page.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AuthLayout from '@/features/auth/components/AuthLayout';
import { VerifyEmailView } from '@/features/auth/components/VerifyEmailView';

export default function VerifyEmailPage() {
  return (
    <AuthLayout 
      title="Vérifiez votre email" 
      subtitle="Un email de confirmation a été envoyé"
    >
      <VerifyEmailView />
      
      {/* Liens de navigation */}
      <div className="flex flex-col items-center space-y-4 text-sm mt-6">
        <Link
          href="/auth/sign-in"
          className="text-violet-300 hover:text-violet-200 transition-colors flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la connexion
        </Link>
        
        <p className="text-violet-400">
          Pas reçu d'email ? Vérifiez vos spams.
        </p>
      </div>
    </AuthLayout>
  );
}