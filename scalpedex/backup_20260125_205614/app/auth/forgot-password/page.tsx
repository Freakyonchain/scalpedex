// /src/app/auth/forgot-password/page.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AuthLayout from '@/features/auth/components/AuthLayout';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout 
      title="Mot de passe oublié" 
      subtitle="Réinitialisez votre mot de passe"
    >
      <ForgotPasswordForm />
      
      {/* Lien de retour */}
      <div className="flex justify-center mt-6">
        <Link
          href="/auth/sign-in"
          className="text-violet-300 hover:text-violet-200 transition-colors flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la connexion
        </Link>
      </div>
    </AuthLayout>
  );
}