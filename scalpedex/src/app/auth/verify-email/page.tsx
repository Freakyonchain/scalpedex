'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Scan, Mail, RefreshCw, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClientBrowser } from "@/lib/supabase/client"

export default function VerifyEmail() {
  const [email, setEmail] = useState("")
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClientBrowser()

  useEffect(() => {
    // Récupérer l'email de la session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email) {
        setEmail(session.user.email)
      }
    }
    getSession()
  }, [])

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setCanResend(true)
    }
  }, [countdown])

  const handleResendEmail = async () => {
    setLoading(true)
    setError("")
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (resendError) throw resendError

      setCanResend(false)
      setCountdown(60)
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'envoi de l'email")
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
          <h1 className="text-3xl font-bold text-white">Vérifiez votre email</h1>
          <p className="mt-2 text-violet-300">Un email de confirmation a été envoyé</p>
        </div>

        {/* Contenu principal */}
        <div className="bg-violet-900/20 border border-violet-800/30 rounded-xl p-6 backdrop-blur-sm space-y-6">
          {/* Icon et message */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-3 bg-violet-500/20 rounded-full">
              <Mail className="h-8 w-8 text-violet-400" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-white">
                Nous avons envoyé un email de confirmation à
              </p>
              <p className="font-medium text-violet-300">
                {email || "votre adresse email"}
              </p>
            </div>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-900/30 border border-red-800/30 rounded-lg p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Instructions */}
          <div className="text-violet-300 text-sm space-y-2">
            <p>Pour compléter votre inscription :</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Vérifiez votre boîte de réception</li>
              <li>Cliquez sur le lien de confirmation dans l'email</li>
              <li>Connectez-vous à votre compte</li>
            </ol>
          </div>

          {/* Bouton de renvoi */}
          <button
            onClick={handleResendEmail}
            disabled={!canResend || loading}
            className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center
              ${canResend 
                ? 'bg-violet-600 hover:bg-violet-500 text-white' 
                : 'bg-violet-900/50 text-violet-400 cursor-not-allowed'}`}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <RefreshCw className={`mr-2 h-5 w-5 ${!canResend && countdown > 0 && 'animate-spin'}`} />
                {canResend 
                  ? "Renvoyer l'email" 
                  : `Renvoyer dans ${countdown} secondes`}
              </>
            )}
          </button>
        </div>

        {/* Liens de navigation */}
        <div className="flex flex-col items-center space-y-4 text-sm">
          <Link
            href="/auth/sign-in"
            className="text-violet-300 hover:text-violet-200 transition-colors flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la connexion
          </Link>
          
          <p className="text-violet-400">
            Pas reçu d'email ? Vérifiez vos spams.
          </p>
        </div>
      </div>
    </div>
  )
}