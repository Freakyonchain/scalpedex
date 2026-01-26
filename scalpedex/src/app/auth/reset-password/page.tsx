// /src/app/auth/reset-password/page.tsx
import AuthLayout from '@/components/domain/auth/AuthLayout';
import { ResetPasswordForm } from '@/components/domain/auth/ResetPasswordForm';

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