// /src/features/auth/components/AuthLayout.tsx
import React from 'react';
import { Scan } from 'lucide-react';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-violet-950 to-black items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo et titre */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Scan className="h-12 w-12 text-violet-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          {subtitle && <p className="mt-2 text-violet-300">{subtitle}</p>}
        </div>

        {/* Contenu principal */}
        <div className="bg-violet-900/20 border border-violet-800/30 rounded-xl p-6 backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
}