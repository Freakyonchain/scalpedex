// src/app/layout.tsx
import '@/app/globals.css';
import { AuthProvider } from '@shared/components/auth/AuthProvider';
import { BottomNav } from '@/shared/components/layout/BottomNav';
import { Header } from '@/shared/components/layout/Header';
import { Toaster } from 'sonner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="bg-gradient-to-br from-[#1b002e] via-[#1a052f] to-black text-white font-sans antialiased">
        <AuthProvider>
          <Header />

          <main className="flex flex-col min-h-screen bg-gradient-to-br from-violet-950/90 to-black pt-16 pb-28 px-2">
  {children}
</main>



          <BottomNav />

          <Toaster
            theme="dark"
            position="top-center"
            richColors
            toastOptions={{
              style: {
                background: 'rgba(109, 40, 217, 0.25)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                fontWeight: 500,
                letterSpacing: '0.015em',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
