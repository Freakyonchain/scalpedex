// /src/app/auth/sign-up/page.tsx
import Link from 'next/link';
import AuthLayout from '@/components/domain/auth/AuthLayout';
import { SignUpForm } from '@/components/domain/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <AuthLayout 
      title="ScalpeDex" 
      subtitle="Créer votre compte"
    >
      <SignUpForm />
      
      {/* Liens supplémentaires */}
      <div className="text-center text-sm mt-6">
        <div className="text-violet-400">
          Déjà un compte ? 
          <Link 
            href="/auth/sign-in" 
            className="ml-2 text-violet-200 hover:underline"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}