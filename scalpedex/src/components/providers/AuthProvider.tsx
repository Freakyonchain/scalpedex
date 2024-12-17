// src/components/providers/AuthProvider.tsx
"use client"

import { createClientBrowser } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientBrowser()

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user ? { id: user.id, email: user.email ?? "" } : null)
      setLoading(false)
    }

    fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email ?? "" })
        } else {
          setUser(null)
        }
        router.refresh()
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/sign-in")
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}