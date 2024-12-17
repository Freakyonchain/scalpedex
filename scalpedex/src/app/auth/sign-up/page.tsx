'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientBrowser } from "@/lib/supabase/client"
import { Eye, EyeOff, Loader2, Scan } from "lucide-react"
import Link from "next/link"

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Vérification des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setLoading(false)
      return
    }

    // Vérification de la force du mot de passe
    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères")
      setLoading(false)
      return
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (signUpError) {
        throw signUpError
      }

      router.push("/auth/verify-email")
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'inscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-violet-950 to-black items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo et titre */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Scan className="h-12 w-12 text-violet-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">ScalpeDex</h1>
          <p className="mt-2 text-violet-300">Créer votre compte</p>
        </div>

        {/* Formulaire d'inscription */}
        <div className="bg-violet-900/20 border border-violet-800/30 rounded-xl p-6 backdrop-blur-sm">
          <form onSubmit={handleSignUp} className="space-y-4">
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

            {/* Champ Confirmation Mot de passe */}
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

            {/* Bouton d'inscription */}
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
        </div>

        {/* Liens supplémentaires */}
        <div className="text-center text-sm">
          <div className="text-violet-400">
            Déjà un compte ? 
            <Link 
              href="/auth/sign-in" 
              className="ml-2 text-violet-200 hover:underline"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}