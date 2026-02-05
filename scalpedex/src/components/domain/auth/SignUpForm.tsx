// /src/features/auth/components/SignUpForm.tsx
'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useSignUp } from '@/hooks/useSignUp';

export function SignUpForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { loading, error, signUp } = useSignUp();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signUp(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-900/30 border border-red-800/30 rounded-lg p-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <input
          type="email"
          name="email"
          placeholder="Adresse email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-3 py-2 bg-black/20 border border-violet-800/30 rounded-lg text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          required
          autoComplete="email"
          autoFocus
        />
      </div>

      <div className="space-y-2 relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Mot de passe"
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
        disabled={loading}
        className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Création en cours...
          </>
        ) : (
          "Créer un compte"
        )}
      </button>
    </form>
  );
}