"use client"

import { useState, useEffect } from 'react'
import { Scan, Sparkles, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientBrowser } from '@client/supabase'
import { Button } from '@/shared/components/ui/button'
import { motion } from 'framer-motion'

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
    <div className="flex min-h-screen flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Effet de lumière d'ambiance */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 via-transparent to-transparent" />
      
      {/* Logo et Titre */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-12 text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <Sparkles className="h-16 w-16 text-violet-400" />
            <div className="absolute inset-0 animate-pulse bg-violet-500/20 rounded-full blur-xl" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-white mb-3">
          ScalpeDex
        </h1>
        <p className="text-violet-300 text-lg font-medium">
          Scalpe plus vite que ton ombre
        </p>
      </motion.div>

      {/* Actions principales */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md space-y-4 relative"
      >
        {isAuthenticated ? (
          <>
            <Link href="/scan" className="block">
              <Button
                className="w-full h-16 text-lg bg-violet-600 hover:bg-violet-500 hover:scale-[1.02] transform transition-all duration-200"
              >
                <Scan className="w-6 h-6 mr-2" />
                Scanner maintenant
              </Button>
            </Link>
            <Link href="/collection" className="block">
              <Button
                variant="outline"
                className="w-full h-14 text-base border-violet-700/50 bg-violet-900/20 hover:bg-violet-800/30 text-violet-100"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Voir ma collection
              </Button>
            </Link>
          </>
        ) : (
          <Button
            onClick={handleSignIn}
            className="w-full h-16 text-lg bg-violet-600 hover:bg-violet-500 hover:scale-[1.02] transform transition-all duration-200"
          >
            Commencer à scalper
            <Sparkles className="ml-2 w-5 h-5" />
          </Button>
        )}
      </motion.div>

      {/* Stats minimalistes */}
      {!isAuthenticated && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex gap-8 text-center"
        >
          <div>
            <p className="text-2xl font-bold text-violet-400">+1000</p>
            <p className="text-sm text-violet-300">Cartes scannées</p>
          </div>
          <div className="w-px bg-violet-800/30" />
          <div>
            <p className="text-2xl font-bold text-violet-400">24/7</p>
            <p className="text-sm text-violet-300">Prix temps réel</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}