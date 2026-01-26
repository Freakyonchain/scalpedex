// /src/app/auth/reset-password/page.tsx
import AuthLayout from '@/features/auth/components/AuthLayout';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <AuthLayout 
      title="Réinitialiser le mot de passe" 
      subtitle="Définissez votre nouveau mot de passe"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}