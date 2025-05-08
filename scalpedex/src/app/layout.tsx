// src/app/layout.tsx
import '@/app/globals.css'
import { AuthProvider } from '@shared/components/auth/AuthProvider'
import { BottomNav } from '@/shared/components/layout/BottomNav'
import { Header } from '@/shared/components/layout/Header'
import { Toaster } from 'sonner'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          <Header />
          <main className="min-h-screen bg-gradient-to-br from-violet-950 to-black pb-24 pt-16">
            {children}
          </main>
          <BottomNav />
          <Toaster 
            theme="dark"
            position="top-center"
            richColors
            toastOptions={{
              style: {
                background: 'rgba(109, 40, 217, 0.2)',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                backdropFilter: 'blur(8px)',
                color: 'white',
              }
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}