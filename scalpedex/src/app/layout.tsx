// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs';
import { BottomNav } from '@/components/layout/BottomNav';
import { Toaster } from 'sonner';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body>
          {children}
          <Toaster 
            theme="dark"
            position="top-center"
            toastOptions={{
              style: {
                background: 'rgba(109, 40, 217, 0.2)',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                backdropFilter: 'blur(8px)',
                color: 'white',
              }
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}