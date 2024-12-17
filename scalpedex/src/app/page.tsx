// src/app/page.tsx
"use client"

import { Scan, TrendingUp, Library } from 'lucide-react'
import Link from 'next/link'
import { createClientBrowser } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const supabase = createClientBrowser()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }
    checkAuth()
  }, [supabase])

  const handleSignIn = () => {
    router.push('/auth/sign-in')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold text-white">ScalpeDex</h1>
        <p className="text-lg text-violet-300">
          Votre compagnon pour la gestion de collection Pokémon
        </p>
      </div>

      <div className="grid w-full max-w-md gap-4">
        {isAuthenticated ? (
          <>
            <Link
              href="/scan"
              className="flex items-center justify-between rounded-lg bg-violet-600 p-4 text-white transition-all hover:bg-violet-500"
            >
              <span className="flex items-center gap-2">
                <Scan className="h-5 w-5" />
                Scanner un produit
              </span>
            </Link>

            <Link
              href="/collection"
              className="flex items-center justify-between rounded-lg bg-violet-900/50 p-4 text-white transition-all hover:bg-violet-800/50"
            >
              <span className="flex items-center gap-2">
                <Library className="h-5 w-5" />
                Voir ma collection
              </span>
            </Link>
          </>
        ) : (
          <button
            onClick={handleSignIn}
            className="flex items-center justify-center rounded-lg bg-violet-600 p-4 text-white transition-all hover:bg-violet-500"
          >
            Se connecter
          </button>
        )}
      </div>
    </div>
  )
}