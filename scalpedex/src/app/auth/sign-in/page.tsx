'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientBrowser } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Loader2, Scan } from "lucide-react"
import Link from "next/link"

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClientBrowser()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError("")
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (signInError) {
        throw signInError
      }

      router.push("/collection")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-violet to-black-950 items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo et titre */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Scan className="h-12 w-12 text-violet-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">ScalpeDex</h1>
          <p className="mt-2 text-violet-300">Connexion à votre compte</p>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-violet-900/20 border border-violet-800/30 rounded-xl p-6 backdrop-blur-sm">
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Gestion des erreurs */}
            {error && (
              <div className="bg-red-900/30 border border-red-800/30 rounded-lg p-3 text-red-300 text-sm">
                {error}
              </div>
            )}

            {/* Champ Email */}
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

            {/* Champ Mot de passe */}
            <div className="space-y-2 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-black/20 border border-violet-800/30 rounded-lg text-white placeholder-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500 pr-10"
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

            {/* Bouton de connexion */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>

        {/* Liens supplémentaires */}
        <div className="text-center space-y-4 text-sm">
          <Link 
            href="/auth/forgot-password" 
            className="text-violet-300 hover:text-violet-200 transition-colors"
          >
            Mot de passe oublié ?
          </Link>
          <div className="text-violet-400">
            Pas encore de compte ? 
            <Link 
              href="/auth/sign-up" 
              className="ml-2 text-violet-200 hover:underline"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}