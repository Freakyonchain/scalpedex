// /src/app/auth/sign-in/page.tsx
import Link from 'next/link';
import AuthLayout from '@/features/auth/components/AuthLayout';
import { SignInForm } from '@/features/auth/components/SignInForm';

export default function SignInPage() {
  return (
    <AuthLayout 
      title="ScalpeDex" 
      subtitle="Connexion à votre compte"
    >
      <SignInForm />
      
      {/* Liens supplémentaires */}
      <div className="text-center space-y-4 text-sm mt-6">
        <Link 
          href="/auth/forgot-password" 
          className="text-violet-300 hover:text-violet-200 transition-colors"
        >
          Mot de passe oublié ?
        </Link>
        <div className="text-violet-400">
          Pas encore de compte ? 
          <Link 
            href="/auth/sign-up" 
            className="ml-2 text-violet-200 hover:underline"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}