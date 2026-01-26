// /src/features/auth/components/SignInForm.tsx
'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useSignIn } from '@/hooks/useSignIn'
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';

export function SignInForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, signIn } = useSignIn();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      <div className="space-y-2">
        <Input
          type="email"
          name="email"
          placeholder="Adresse email"
          value={formData.email}
          onChange={handleInputChange}
          required
          autoComplete="email"
          autoFocus
        />
      </div>

      <div className="space-y-2 relative">
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleInputChange}
          required
          autoComplete="current-password"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-400"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <Button
        type="submit"
        disabled={loading}
        isLoading={loading}
        loadingText="Connexion en cours..."
        className="w-full"
      >
        Se connecter
      </Button>
    </form>
  );
}