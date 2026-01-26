// src/app/layout.tsx
import '@/app/globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { BottomNav } from '@/components/layout/BottomNav';
import { Toaster } from 'sonner';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'ScalpeDex | Market Intelligence for Pokémon Investors',
  description: 'L\'outil ultime de Market Intelligence pour les investisseurs et scalpers Pokémon. Scanner, analyser, dominer.',
  keywords: ['pokemon', 'tcg', 'scalping', 'investment', 'market', 'cards'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#050505',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="bg-background text-white font-sans antialiased overflow-x-hidden">
        <AuthProvider>
          {/* Animated Background Layer */}
          <div className="fixed inset-0 -z-10">
            {/* Mesh Gradient - Subtle animated blobs */}
            <div 
              className="absolute inset-0 opacity-100"
              style={{
                background: `
                  radial-gradient(ellipse 80% 50% at 20% 40%, rgba(124, 58, 237, 0.12) 0%, transparent 50%),
                  radial-gradient(ellipse 60% 40% at 80% 60%, rgba(0, 255, 163, 0.06) 0%, transparent 50%),
                  radial-gradient(ellipse 50% 30% at 50% 80%, rgba(124, 58, 237, 0.08) 0%, transparent 50%),
                  #050505
                `,
              }}
            />
            
            {/* Tactical Grid Overlay */}
            <div 
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            />
            
            {/* Noise Texture */}
            <div 
              className="absolute inset-0 opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Main Content */}
          <main className="relative min-h-screen pb-28">
            {children}
          </main>

          {/* Bottom Navigation HUD */}
          <BottomNav />

          {/* Toast Notifications - Premium Dark Style */}
          <Toaster
            theme="dark"
            position="top-center"
            gap={8}
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(18, 18, 18, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '500',
                padding: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              },
              className: 'font-sans',
              descriptionClassName: 'text-zinc-400',
            }}
            icons={{
              success: (
                <div className="w-5 h-5 rounded-full bg-profit/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-profit animate-pulse" />
                </div>
              ),
              error: (
                <div className="w-5 h-5 rounded-full bg-loss/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-loss animate-pulse" />
                </div>
              ),
              info: (
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
              ),
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}